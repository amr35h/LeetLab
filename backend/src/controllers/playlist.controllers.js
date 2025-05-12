import { db } from "../db/index.js";

export const createPlaylist = async (req, res) => {
  try {
    const { name, description } = req.body;
    const userId = req.user.id;

    const playlist = await db.playlist.create({
      data: {
        name,
        description,
        userId,
      },
    });

    req.status(200).json({
      success: true,
      message: "Playlist Created Successfully",
      playlist,
    });
  } catch (error) {
    console.error("Playlist Create Error:", error);
    res.status(500).json({ message: "Failed to create Playlist" });
  }
};

export const getAllListDetails = async (req, res) => {
  try {
    const playlists = await db.playlist.findMany({
      where: {
        userId: req.user.id,
      },
      include: {
        problems: {
          include: {
            problem: true,
          },
        },
      },
    });

    res.status(200).json({
      success: true,
      message: "Playlist Fetched Successfully",
      playlists,
    });
  } catch (error) {
    console.error("Fetch Playlists Error:", error);
    res.status(500).json({ message: "Failed to fetch Playlists" });
  }
};

export const getPlaylistDetails = async (req, res) => {
  const { playlistId } = req.params;
  try {
    const playlist = db.playlist.findUnique({
      where: {
        id: playlistId,
        userId: req.user.id,
      },
      include: {
        problems: {
          include: {
            problem: true,
          },
        },
      },
    });

    if (!playlist) {
      return res.status(404).json({
        success: false,
        message: "Playlist not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Playlist Fetched Successfully",
      playlist,
    });
  } catch (error) {
    console.error("Fetch Playlist Error:", error);
    res.status(500).json({ message: "Failed to fetch Playlist" });
  }
};

export const addProblemToPlaylist = async (req, res) => {
  const { playlistId } = req.params;
  const { problemIds } = req.body;

  try {
    if (!Array.isArray(problemIds) || problemIds.length === 0) {
      return res
        .status(400)
        .json({ message: "Invalid or Missing Problem Ids" });
    }

    //Create records for each problems in the playlist
    const problemInPlaylist = await db.problemsInPlaylist.createMany({
      data: problemIds.map((problemId) => {
        playlistId, problemId;
      }),
    });

    res.status(201).json({
      success: true,
      message: "Problems added to Playlist",
      problemInPlaylist,
    });
  } catch (error) {
    console.error("Add Problems in Playlist Error:", error);
    res.status(500).json({ message: "Failed to add Problems in Playlist" });
  }
};

export const deletePlaylist = async (req, res) => {
  const { playlistId } = req.params;

  try {
    const deletedPlaylist = await db.playlist.delete({
      where: {
        id: playlistId,
      },
    });

    res.status(200).json({
      success: true,
      message: "Playlist deleted Successfully",
      deletedPlaylist,
    });
  } catch (error) {
    console.error("Delete Playlist Error:", error);
    res.status(500).json({ message: "Failed to delete Playlist" });
  }
};

export const removeProblemFromPlaylist = async (req, res) => {
  const { playlistId } = req.params;
  const { problemIds } = req.body;

  try {
    if (!Array.isArray(problemIds) || problemIds.length === 0) {
      return res
        .status(400)
        .json({ message: "Invalid or Missing Problem Ids" });
    }

    const deletedProblems = await db.problemsInPlaylist.delete({
      where: {
        playlistId,
        problemId: {
          in: problemIds,
        },
      },
    });

    res.status(200).json({
      success: true,
      message: "Problems deleted from Playlist Successfully",
      deletedProblems,
    });
  } catch (error) {
    console.error("Delete Problem from Playlist Error:", error);
    res
      .status(500)
      .json({ message: "Failed to delete Problems form Playlist" });
  }
};
