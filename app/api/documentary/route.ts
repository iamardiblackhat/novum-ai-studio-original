import { NextRequest } from "next/server";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

const CLIP_DURATION = 5;
const TOTAL_DURATION = 75;
const NUM_CLIPS = Math.floor(TOTAL_DURATION / CLIP_DURATION); // 15 clips

export async function POST(req: NextRequest) {
  try {
    const {
      footage = [],
      musicPrompt,
      apiKeys = {},
    } = await req.json();

    if (!Array.isArray(footage) || footage.length === 0) {
      return Response.json(
        {
          success: false,
          error:
            "No footage provided. Please upload real video footage of city life in the rain.",
        },
        { status: 400 }
      );
    }

    // Distribute uploaded footage across the 75-second timeline (15 × 5s clips)
    const clips = [];
    for (let i = 0; i < NUM_CLIPS; i++) {
      const srcIndex = i % footage.length;
      clips.push({
        index: i,
        url: footage[srcIndex].url,
        name: footage[srcIndex].name || `Clip ${srcIndex + 1}`,
        duration: CLIP_DURATION,
        startTime: i * CLIP_DURATION,
        endTime: (i + 1) * CLIP_DURATION,
        position: i,
      });
    }

    // Generate elegiac music score
    const defaultMusicPrompt =
      "Elegiac ambient piano composition, melancholic and contemplative, soft strings, rain ambiance, slow tempo, minor key, cinematic documentary score";

    let musicUrl = "";
    try {
      const musicRes = await fetch(`${req.nextUrl.origin}/api/music`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: musicPrompt || defaultMusicPrompt,
          duration: TOTAL_DURATION,
          apiKeys,
        }),
      });

      if (musicRes.ok) {
        const musicData = await musicRes.json();
        musicUrl = musicData.url || "";
      }
    } catch {
      // Music generation is optional — proceed without if it fails
    }

    return Response.json({
      success: true,
      totalDuration: TOTAL_DURATION,
      clipDuration: CLIP_DURATION,
      numClips: NUM_CLIPS,
      clips,
      music: {
        url: musicUrl,
        prompt: musicPrompt || defaultMusicPrompt,
        duration: TOTAL_DURATION,
      },
      timeline: clips.map((c) => ({
        startTime: c.startTime,
        endTime: c.endTime,
        url: c.url,
        name: c.name,
        position: c.position,
      })),
      footageRequired: {
        minClips: 1,
        suggestedClips: 5,
        maxClips: NUM_CLIPS,
        note: "Footage is cycled to fill the 75-second timeline. For best results, upload 5+ unique clips.",
      },
    });
  } catch (error: unknown) {
    return Response.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Documentary assembly failed",
      },
      { status: 500 }
    );
  }
}