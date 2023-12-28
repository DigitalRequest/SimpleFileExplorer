import React, { useState } from "react";

export interface MyData {
    path: string;
    is_dir: boolean;
    sub_paths: MyData[];
}

interface DataType {
    elm: MyData;
    returnData(itemData: MyData): void;
}

const TreeItem: React.FC<DataType> = ({ elm, returnData }) => {
    const [active, setActive] = useState(false);

    const handleClick = () => {
        if (elm.is_dir) {
            setActive(!active);
        } else {
            returnData(elm);
        }
    };

    return (
        <>
            <a onClick={handleClick}>{elm.path.split("\\").pop()}</a>
            <ul>
                {active ? (
                    elm.sub_paths.map((sub: MyData) => (
                        <li key={sub.path}>
                            <TreeItem elm={sub} returnData={returnData} />
                        </li>
                    ))
                ) : (
                    <></>
                )}
            </ul>
        </>
    );
};

export default TreeItem;
