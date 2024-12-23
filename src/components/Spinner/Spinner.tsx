import React from 'react'
import ReactModal from 'react-modal'
import styles from "./styles.module.scss"

export const Spinner = ({isOpen}) => {
    return (
        <ReactModal 
        overlayClassName={`${styles.modalOverlay}`}
        className={`${styles.modalContent}`}
        isOpen={isOpen}>

            <div className={styles.container}></div>
        </ReactModal>
    )
}
