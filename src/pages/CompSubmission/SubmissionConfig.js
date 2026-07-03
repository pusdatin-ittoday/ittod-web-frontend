import { FaItchIo, FaYoutube, FaGoogleDrive } from "react-icons/fa";

export const SUBMISSION_FIELDS = {
  gametoday: [
    { 
      name: "SubmisiGame", 
      label: "Submisi Game (itch.io)", 
      icon: FaItchIo, 
      placeholder: "Link Submisi Game (itch.io)" 
    }
  ],
  uxtoday: [
    { 
      name: "TrailerKarya", 
      label: "Trailer Karya (youtube)", 
      icon: FaYoutube, 
      placeholder: "Link Karya (Youtube)" 
    },
    { 
      name: "Proposal", 
      label: "Proposal (Drive)", 
      icon: FaGoogleDrive, 
      placeholder: "Link Drive Proposal" 
    }
  ],
  minetoday: [
    { 
      name: "Drive", 
      label: "Notebook, Model, Hasil Submission.csv (Drive)", 
      icon: FaGoogleDrive, 
      placeholder: "Link Drive notebook, model, hasil submission" 
    }
  ]
};
