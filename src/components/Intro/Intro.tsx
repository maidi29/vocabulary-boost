import React, { useContext} from 'react';
import {Link} from "../Link/Link";
import {PractiseContext} from "../../context/PractiseContext";

export const Intro = (): JSX.Element => {
    const { archive, isArchive, setIsArchive, trainingSet } = useContext(PractiseContext);

    return (
        <>
            <h1>Practise the words you learned while browsing</h1>
            <div className="column">
                <h2>Learned words: {archive.length}</h2>
                { archive.length > 0 &&
                    <Link onClick={()=>setIsArchive(!isArchive)}>
                        {isArchive ? 'Leave archive' : 'Practise archive'}
                    </Link>
                }
            </div>
            Words in trainingset: {trainingSet.length}
        </>
    );
}
