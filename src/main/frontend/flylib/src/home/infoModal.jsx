import { useEffect, useState } from "react";
import "./infoModal.css";

export default function InfoModal({ setModalOpen, modalPosition, children }) {
    const [adjustedPosition, setAdjustedPosition] = useState({ top: 0, left: 0 });

    // Close the modal if window is resized and page changes from mobile to browser version
    const [windowSize, setWindowSize] = useState(window.innerWidth);

    useEffect(() => {
        const handleResize = () => {
            if (windowSize < 769 && window.innerWidth >= 769) {
                setModalOpen(false); // Close modal when moving from small to large screen
            } else if (windowSize >= 769 && window.innerWidth < 769) {
                setModalOpen(false); // Close modal when moving from large to small screen
            }

            setWindowSize(window.innerWidth);
        };

        window.addEventListener("resize", handleResize);

        return () => window.removeEventListener("resize", handleResize);
    }, [windowSize, setModalOpen]);

    // Adjust position of modal when resizing
    useEffect(() => {
        const padding = 10;
        const modalWidth = 300;
        const modalHeight = 200;

        let newLeft = modalPosition.left;
        let newTop = modalPosition.top;

        // Check if modal overflows right edge
        if (newLeft + modalWidth > window.innerWidth) {
            newLeft = window.innerWidth - modalWidth - padding;
        }

        // Check if modal overflows bottom
        if (newTop + modalHeight > window.innerHeight) {
            newTop = window.innerHeight - modalHeight - padding;
        }

        setAdjustedPosition({ top: newTop, left: newLeft });
    }, [modalPosition]);

    function onCloseClick() {
        setModalOpen(false);
        document.body.classList.remove("no-scroll");
    }

    return (
        <div className="info-modal-container">
            <div className="info-modal" style={{ top: `${adjustedPosition.top}px`, left: `${adjustedPosition.left}px`, position: "absolute" }}>
                <button className="info-close" onClick={onCloseClick}>
                    &times;
                </button>
                <div className="info-modal-content-container">{children}</div>
            </div>
        </div>
    );
}
