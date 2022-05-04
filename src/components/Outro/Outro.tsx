import React, { useContext} from 'react';
import {Link} from "../Link/Link";
import {PractiseContext} from "../../context/PractiseContext";
import classnames from "classnames";
import styles from './Outro.module.scss';
import {getFlagEmoji} from "../../scripts/util";

export const Outro = (): JSX.Element => {
    const { setModalIsOpen, language } = useContext(PractiseContext);

    return (
        <div className={classnames("column", styles.bottomRow)}>
            <div className="row"><span>Native Language: {language ? getFlagEmoji(language) : 'not set'}</span>
                <Link onClick={()=>setModalIsOpen(true)}>Change</Link></div>
            <div><a href="https://www.buymeacoffee.com/maidi" className={styles.donutLink}>🍩 Buy me a donut</a></div>
        </div>
    );
}
