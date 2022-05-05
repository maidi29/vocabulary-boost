import React from 'react';
import {IndexCard} from "../IndexCard/IndexCard";
import {IndexCardSide, Variants} from "../IndexCard/IndexCardSide/IndexCardSide";
import classnames from "classnames";
import styles from './EmptyTrainingSetArea.module.scss';
import {Button} from "../Button/Button";

export const EmptyTrainingsetArea = (): JSX.Element => {
    return (
        <div className={"column"}>
            <IndexCard>
                <IndexCardSide variant={Variants.FRONT}>
                    <div>No words in training set</div>
                    <div className={styles.refreshButton}><Button onClick={()=>window.location.reload()} title={"Refresh"}>⟲</Button></div>
                </IndexCardSide>
            </IndexCard>
            <div className={classnames("column", styles.infoBox)}>
                <div>To add words to your training set, select an english word while browsing with</div>
                <h1 className="row">
                    <img src="./images/icons/ctrl.png"/> + <div className="row no-gap">2x<img src="./images/icons/click.png"/></div>
                </h1>
                <div>
                    (Ctrl + Double Click)
                </div>
                <div>see the translation and click the button "Add to training set".</div>
            </div>
        </div>
    );
}
