import React, { useState, useEffect } from "react";
import Sidebar from "./components/Sidebar.jsx";
import Editor from "./components/Editor.jsx";
import Split from "react-split";
import { notesCollection, db } from "./config/firebase.js";
import { addDoc, deleteDoc, doc, onSnapshot, setDoc } from "firebase/firestore";

/**
 * Challenge:
 * 1. Set up a new state variable called `tempNoteText`. Initialize
 *    it as an empty string
 * 2. Change the Editor so that it uses `tempNoteText` and
 *    `setTempNoteText` for displaying and changing the text instead
 *    of dealing directly with the `currentNote` data.
 * 3. Create a useEffect that, if there's a `currentNote`, sets
 *    the `tempNoteText` to `currentNote.body`. (This copies the
 *    current note's text into the `tempNoteText` field so whenever
 *    the user changes the currentNote, the editor can display the
 *    correct text.
 * 4. TBA
 */

export default function App() {
	const [notes, setNotes] = useState([]);
	const [currentNoteId, setCurrentNoteId] = useState("");

	const [tempNoteText, setTempNoteText] = useState("");

	const currentNote =
		notes.find((note) => {
			return note.id === currentNoteId;
		}) || notes[0];

	useEffect(() => {
		currentNote && setTempNoteText(currentNote.body);
	}, [currentNote]);

	useEffect(() => {
		const unsub = onSnapshot(notesCollection, (snapshot) => {
			const notesArr = snapshot.docs.map((doc) => ({
				...doc.data(),
				id: doc.id,
			}));

			const sortedNotesArr = notesArr.sort(
				(a, b) => b.updatedAt - a.updatedAt
			);

			setNotes(sortedNotesArr);
		});

		return unsub;
	}, []);

	useEffect(() => {
		if (!currentNoteId) setCurrentNoteId(notes[0]?.id);
	}, [notes]);

	// Debouncing logic
	useEffect(() => {
		const timeoutId = setTimeout(() => {
			currentNote?.body !== tempNoteText && updateNote(tempNoteText);
		}, 500);

		return () => clearTimeout(timeoutId);
	}, [tempNoteText]);

	const createNewNote = async () => {
		try {
			const newNote = {
				body: "# Note title \n\n Type your markdown here",
				createdAt: Date.now(),
				updatedAt: Date.now(),
			};

			const newNoteRef = await addDoc(notesCollection, newNote);
			setCurrentNoteId(newNoteRef.id);
		} catch (err) {
			console.error(err);
		}
	};

	// Update note function - push updated note to the top of list
	async function updateNote(text) {
		try {
			const noteRef = doc(db, "notes", currentNoteId);
			await setDoc(
				noteRef,
				{ body: text, updatedAt: Date.now() },
				{ merge: true }
			);
		} catch (err) {
			console.error(err);
		}
	}

	const deleteNote = async (id) => {
		const noteRef = doc(db, "notes", id);
		await deleteDoc(noteRef);
	};

	return (
		<main>
			{notes.length > 0 ? (
				<Split
					sizes={[30, 70]}
					direction="horizontal"
					className="split"
				>
					<Sidebar
						notes={notes}
						currentNote={currentNote}
						setCurrentNoteId={setCurrentNoteId}
						newNote={createNewNote}
						deleteNote={deleteNote}
					/>

					<Editor
						tempNoteText={tempNoteText}
						setTempNoteText={setTempNoteText}
					/>
				</Split>
			) : (
				<div className="no-notes">
					<h1>You have no notes</h1>
					<button className="first-note" onClick={createNewNote}>
						Create one now
					</button>
				</div>
			)}
		</main>
	);
}
