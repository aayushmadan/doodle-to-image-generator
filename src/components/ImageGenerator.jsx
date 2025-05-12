"use client";

import { useState } from "react";
import DrawingCanvas from "./DrawingCanvas";
import {
  getDoodleDescription,
  generateImageFromDescription,
} from "@/utils/api";
import { Loader2, Sparkles } from "lucide-react";
import { Cabin } from "next/font/google";

const cabin = Cabin({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export default function ImageGenerator() {
  const [canvas, setCanvas] = useState(null);
  const [generatedImage, setGeneratedImage] = useState(null);
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleCanvasDraw = (canvasInstance) => {
    setCanvas(canvasInstance);
  };

  const handleGenerateImage = async () => {
    if (!canvas) {
      setError("Please draw a doodle first.");
      return;
    }

    setLoading(true);
    setError(null);
    setDescription("");

    try {
      // Get the canvas data URL
      const dataUrl = canvas.getDataURL();

      // Step 1: Get description from Gemini AI
      const doodleDescription = await getDoodleDescription(dataUrl);
      setDescription(doodleDescription);

      // Step 2: Generate image from description
      const imageUrl = await generateImageFromDescription(doodleDescription);
      setGeneratedImage(imageUrl);
    } catch (err) {
      setError(`Error: ${err.message}`);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleClearCanvas = () => {
    if (canvas) {
      canvas.clear();
      setGeneratedImage(null);
      setDescription("");
      setError(null);
    }
  };

  return (
    <div className="flex flex-col md:flex-row p-3 w-full max-w-4xl md:gap-0 gap-2">
      {/* Drawing Canvas */}
      <div className="flex-1 bg-white p-4 rounded-lg">
        <h2 className="text-xl font-semibold mb-2 text-gray-700">
          Draw Your Doodle
        </h2>
        <DrawingCanvas onDraw={handleCanvasDraw} />
        <div className="mt-4 flex gap-4">
          <button
            onClick={handleGenerateImage}
            className="bg-pink-500 text-white px-4 py-2 rounded-lg hover:bg-pink-600 transition-colors hover:cursor-pointer disabled:bg-blue-300 flex items-center justify-center"
            disabled={loading}
          >
            {loading && <Loader2 className="animate-spin mr-2 h-4 w-4" />}
            {loading ? "Generating..." : "Generate Image"}
          </button>

          <button
            onClick={handleClearCanvas}
            className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 hover:cursor-pointer"
            disabled={loading}
          >
            Clear Canvas
          </button>
        </div>
      </div>

      {/* Generated Image */}
      <div className="flex-1 bg-white p-4 rounded-lg">
        <h2 className="text-xl font-semibold mb-2 text-gray-700">
          Generated Image
        </h2>
        <div className="w-full h-[400px] border-none bg-gray-200 rounded-none flex items-center justify-center">
          {generatedImage ? (
            <img
              src={generatedImage}
              alt="Generated"
              className="max-w-full max-h-full object-contain"
            />
          ) : loading ? (
            <div className="flex flex-col items-center justify-center">
              <Loader2 className="animate-spin mb-2 h-8 w-8 text-pink-500" />
              <p className="text-gray-500">Generating the image...</p>
            </div>
          ) : (
            <p className="text-gray-500">
              Draw a doodle and click "Generate Image"
            </p>
          )}
        </div>

        {description && (
          <div className="bg-gray-100 text-left rounded-lg px-3 py-2 mt-3 transition-all duration-1000 ">
            <p
              className={`${cabin.className} font-semibold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-blue-600 transition-opacity duration-[2000ms] opacity-100`}
            >
              {description}
            </p>
          </div>
        )}

        <div className="mt-3">
          {error && <p className="mt-4 text-red-500">Failed to generate the image, try again.</p>}
        </div>
      </div>
    </div>
  );
}