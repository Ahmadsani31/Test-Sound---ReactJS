import { useState } from 'react';

import imgShout from '../assets/img/shout.png';
export default function FloatingIcon({ position = 'right', level = '' }) {
    // State untuk posisi icon
    const [yPosition, setYPosition] = useState(250);
    const [dragging, setDragging] = useState(false);
    const [offset, setOffset] = useState(0);

    // Fungsi untuk memulai drag
    const handleMouseDown = (e: any) => {
        setDragging(true);
        setOffset(e.clientY - yPosition); // Menyimpan selisih posisi mouse dan posisi icon saat drag dimulai
    };

    // Fungsi untuk menggeser icon secara vertikal
    const handleMouseMove = (e: any) => {
        if (dragging) {
            setYPosition(e.clientY - offset); // Mengubah posisi vertikal berdasarkan pergerakan mouse
        }
    };

    // Fungsi untuk menghentikan drag
    const handleMouseUp = () => {
        setDragging(false);
    };

    // Styling posisi tetap di kiri atau kanan, dan hanya menggeser vertikal
    const sidePosition = position === 'right' ? 'right' : 'left';

    return (
        <div
            className="position-fixed"
            style={{
                [sidePosition]: '0', // Tetap berada di sisi kiri atau kanan
                top: `${yPosition}px`, // Posisi vertikal bisa berubah
                cursor: dragging ? 'grabbing' : 'grab', // Kursor berubah saat dragging
                width: '160px',
                zIndex: '999',
            }}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp} // Menghentikan drag jika mouse keluar
        >
            <div
                className={`db-indicator  ${level.replace(' ', '-')}`} id="dbIndicator"
            >
                <div className="level"><img src={imgShout} alt="sh-icon" width={30} /> (  {level.charAt(0).toUpperCase() + level.slice(1)})</div>
            </div>
        </div>
    );
};

