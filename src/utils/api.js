const GEMINI_API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
const HUGGING_FACE_API_KEY = process.env.NEXT_PUBLIC_HUGGING_FACE_API_KEY;

const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';
const HUGGING_FACE_API_URL = 'https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0';

/**
 * Get description of a doodle using Google's Gemini AI
 * @param {string} dataUrl - Base64 encoded image data URL
 * @returns {Promise<string>} - Description of the doodle
 */
export async function getDoodleDescription(dataUrl) {
  try {
    
    const base64Data = dataUrl.split(',')[1];
    
    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              { text: 'Describe this sketch in one sentence, focusing on the main object or scene.' },
              {
                inline_data: {
                  mime_type: 'image/png',
                  data: base64Data,
                },
              },
            ],
          },
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Gemini API error: ${response.status} - ${errorText}`);
    }

    const result = await response.json();
    return result.candidates[0].content.parts[0].text;
  } catch (err) {
    throw new Error(`Failed to get description: ${err.message}`);
  }
}

/**
 * Generate image from description using Hugging Face's Stable Diffusion
 * @param {string} description -
 * @returns {Promise<string>} - URL
 */
export async function generateImageFromDescription(description) {
  try {
    const response = await fetch(HUGGING_FACE_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${HUGGING_FACE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        inputs: `${description}, detailed, realistic style`,
        parameters: {
          num_inference_steps: 50,
          guidance_scale: 7.5,
        },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Hugging Face API error: ${response.status} - ${errorText}`);
    }

    const blob = await response.blob();
    return URL.createObjectURL(blob);
  } catch (err) {
    throw new Error(`Failed to generate image: ${err.message}`);
  }
}