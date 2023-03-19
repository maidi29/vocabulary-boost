import React, { useContext } from "react";
import { PractiseContext } from "../../context/PractiseContext";
import styles from "./LanguageModal.module.scss";
import { addToStorage } from "../../scripts/util";
import { languages } from "../../constants/languages";
import { Radio } from "../Radio/Radio";
import { Button } from "../Button/Button";
import Modal from "react-modal";

export const LanguageModal = (): JSX.Element => {
  const { modalIsOpen, setModalIsOpen, updateLanguage, language } =
    useContext(PractiseContext);

  const closeModal = () => setModalIsOpen(false);

  return (
    <Modal
      appElement={document.getElementById("root") as HTMLElement}
      isOpen={modalIsOpen}
      onRequestClose={closeModal}
      className={styles.modal}
      overlayClassName={styles.modalOverlay}
      shouldCloseOnOverlayClick={!!language}
      shouldCloseOnEsc={!!language}
      contentLabel="Select language"
      bodyOpenClassName="fixed"
    >
      <form
        className={styles.languageForm}
        onSubmit={(e: any) => {
          e.preventDefault();
          if (e.target.language.value) {
              addToStorage({ language: e.target.language.value });
              updateLanguage();
              closeModal();
          }
        }}
      >
        <h3>What's your native language?</h3>
        <div className="column start">
          {languages.map((lang) => (
            <Radio
              name="language"
              value={lang.code}
              label={lang.name}
              key={lang.code}
            />
          ))}
        </div>
        <Button type="submit">Save</Button>
      </form>
    </Modal>
  );
};
