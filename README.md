# Gilbinator: Löser für das Maximum Matching in bipartiten Graphen

## Was ist Gilbinator?

Gilbinator ist eine Node.js-Anwendung, die mithilfe des Ford-Fulkerson-Algorithmus das "Maximum Matching in bipartiten Graphen" Problem visuell löst. Dabei wird ein interaktiver Ansatz gewählt, um das Konzept besser verständlich zu machen.

## Installation

Um Gilbinator zu verwenden, führe die folgenden Schritte aus:

1. Stelle sicher, dass Node.js auf deinem Computer installiert ist.
2. Klon das Repository und navigiere in das Verzeichnis.
3. Öffne ein Terminal und führe `npm install` aus, um die Abhängigkeiten zu installieren.

## Wie funktioniert es?

1. Starte die Anwendung mit `npm run start`.
2. Öffne deinen Webbrowser und gehe zu `http://localhost:3000`.
3. Du wirst aufgefordert, den Schwierigkeitsgrad auszuwählen: "Leicht", "Mittel", "Schwer" oder "Ultra". Diese Auswahl bestimmt, wie viele Knoten generiert werden.
4. Nach der Auswahl siehst du einen bipartiten Graphen mit Studenten auf der einen Seite und Omas auf der anderen Seite. Jeder Student ist über Kanten mit allen Omas verbunden.
5. Drücke "Start Gilbinator", um das Maximum Matching Problem zu lösen. Du siehst nun, wie der Ford-Fulkerson Algorithmus angewendet wird, um die bestmögliche Zuordnung zwischen Studenten und Omas zu finden.

## Ford-Fulkerson Algorithmus

Der Ford-Fulkerson Algorithmus ist ein Graphenalgorithmus zur Lösung des maximalen Flussproblems in einem Netzwerk. In unserem Fall wird er verwendet, um das Maximum Matching Problem in einem bipartiten Graphen zu lösen. Der Algorithmus erhöht iterativ den Fluss über augmentierende Pfade im Netzwerk, indem er rückwärts gerichtete Kanten mit Restkapazität findet. Dieser Prozess wird wiederholt, bis kein solcher Pfad mehr gefunden werden kann. Das resultierende Flussnetzwerk stellt das maximale Matching dar.
