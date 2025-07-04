
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const moderateComment = asyncHandler(async (req, res) => {
    const { comment } = req.body;

    if (!comment) {
        throw new ApiError(400, "Comment text is required");
    }

    const response = await fetch(
        "https://router.huggingface.co/hf-inference/models/unitary/toxic-bert",
        {
            headers: {
                Authorization: `Bearer ${process.env.HF_TOKEN}`,
                "Content-Type": "application/json",
            },
            method: "POST",
            body: JSON.stringify({ inputs: comment }),
        }
    );

    ;
    const result = await response.json();
    const predictions = result[0];
    const threshold = 0.5;
    const toxicResults = predictions.filter(item => item.score >= threshold);

    let warning = null;
    if (toxicResults.length > 0) {
        const labels = toxicResults.map(item => item.label).join(", ");
        warning = `⚠️ This comment may contain inappropriate content: ${labels}`;
    }

    return res
        .status(200)
        .json(new ApiResponse(200, { warning, toxicScores: toxicResults }, "Moderation check completed"));
});

export { moderateComment };
