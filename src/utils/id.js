import shortid from "shortid";

export function generateNoteID() {
  return Date.now() + shortid.generate();
}
