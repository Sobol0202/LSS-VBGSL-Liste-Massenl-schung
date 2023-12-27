// ==UserScript==
// @name         LSS VBGSL-Liste Massenlöschung
// @namespace    www.leitstellenspiel.de
// @version      1.0
// @description  Ermöglicht das Löschen mehrerer VBGSL in der Liste
// @author       MissSobol
// @match        https://www.leitstellenspiel.de/custom_mission_alliance_list
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Füge Checkboxen zu jeder Zeile hinzu, außer in der ersten Zeile
    const rows = document.querySelectorAll('#personal_table tr');
    rows.forEach((row, index) => {
        if (index === 0) {
            // Füge Schaltfläche zum Löschen in der ersten Zeile hinzu
            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Ausgewählte Einsätze löschen';
            deleteButton.className = 'btn btn-danger';
            deleteButton.addEventListener('click', confirmDelete);
            const lastCell = row.lastElementChild;
            lastCell.appendChild(deleteButton);
        } else {
            // Füge Checkboxen in den übrigen Zeilen hinzu
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            const lastCell = row.lastElementChild;
            lastCell.appendChild(checkbox);
        }
    });

    // Funktion zur Bestätigung des Löschvorgangs
    function confirmDelete() {
        const checkboxes = document.querySelectorAll('#personal_table input[type="checkbox"]');
        const selectedEinsaetze = Array.from(checkboxes).filter(checkbox => checkbox.checked);

        if (selectedEinsaetze.length === 0) {
            alert('Bitte wähle mindestens einen Einsatz zum Löschen aus.');
            return;
        }

        const confirmation = confirm(`Möchtest du wirklich ${selectedEinsaetze.length} Großschadenslagen löschen?`);

        if (confirmation) {
            deleteSelected();
        }
    }

    // Funktion zum Löschen ausgewählter Einsätze
    function deleteSelected() {
        const checkboxes = document.querySelectorAll('#personal_table input[type="checkbox"]');
        const selectedEinsaetze = Array.from(checkboxes).filter(checkbox => checkbox.checked);

        let index = 0;

        function deleteNext() {
            if (index < selectedEinsaetze.length) {
                const missionId = selectedEinsaetze[index].closest('tr').querySelector('a.btn-danger').getAttribute('href').match(/\d+/)[0];
                const deleteUrl = `/delete_custom_mission_alliance?mission_id=${missionId}`;

                // Simuliere den Klick auf den Löschen-Link
                simulateClick(deleteUrl);

                // Warte 100ms vor dem nächsten Aufruf
                setTimeout(() => {
                    index++;
                    deleteNext();
                }, 100);
            } else {
                // Nachdem alle Einsätze gelöscht wurden, Seite neu laden
                location.reload();
            }
        }

        deleteNext();
    }

    // Funktion zum Simulieren eines Klicks auf einen Link
    function simulateClick(url) {
        const link = document.createElement('a');
        link.href = url;
        link.style.display = 'none';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
})();
