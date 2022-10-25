import React, { useState, useEffect } from "react";
import Sidebar from "./components/Sidebar.jsx";
import Editor from "./components/Editor.jsx";
import Split from "react-split";
import { nanoid } from "nanoid";

export default function App() {
	const saveNotesToLS = (notes) => {
		notes && localStorage.setItem("notes", JSON.stringify(notes));
	};

	const getNotesFromLS = () => {
		const notesFromLS = JSON.parse(localStorage.getItem("notes"));
		return notesFromLS && notesFromLS;
	};

	const [notes, setNotes] = useState(() => getNotesFromLS() || []);
	const [currentNoteId, setCurrentNoteId] = useState(
		(notes[0] && notes[0].id) || ""
	);

	useEffect(() => {
		saveNotesToLS(notes);
	}, [notes]);

	function createNewNote() {
		const newNote = {
			id: nanoid(),
			body: "# Note title \n\n Type your markdown here",
		};
		setNotes((prevNotes) => [newNote, ...prevNotes]);
		setCurrentNoteId(newNote.id);
	}

	// Update note function - push updated note to the top of list
	function updateNote(text) {
		setNotes((oldNotes) => {
			const newArray = [];
            oldNotes.filter(note => note.id == currentNoteId ? newArray.unshift({ ...note, body: text }) : newArray.push(note))
            return newArray;
		});

	}

	function findCurrentNote() {
		return (
			notes.find((note) => {
				return note.id === currentNoteId;
			}) || notes[0]
		);
	}

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
						currentNote={findCurrentNote()}
						setCurrentNoteId={setCurrentNoteId}
						newNote={createNewNote}
					/>
					{currentNoteId && notes.length > 0 && (
						<Editor
							currentNote={findCurrentNote()}
							updateNote={updateNote}
						/>
					)}
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
