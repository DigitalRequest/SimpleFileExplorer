import { useState } from "react";
import myData from "../GO/file_list.json";
import TreeItem, { MyData } from "./Components/TreeItem";
import { saveAs } from "file-saver";

const transformData = (data: any): MyData => {
    return {
        path: data.path,
        is_dir: data.is_dir,
        sub_paths: Array.isArray(data.sub_paths)
            ? data.sub_paths.map(transformData)
            : [],
    };
};

// Assuming myData is an array, iterate over each element and transform it
const transformedData: MyData[] = myData.map(transformData);

function App() {
    const [data, setData] = useState<MyData | null>(null);
    const [stringData, setStringData] = useState<string | null>(null);

    const handleReturnData = async (itemData: MyData) => {
        setData(itemData);
        const fileContent = await readFile(itemData.path);
        setStringData(fileContent);
    };

    const readFile = (path: string): Promise<string> => {
        return new Promise((resolve, reject) => {
            fetch(path)
                .then((response) => {
                    if (!response.ok) {
                        throw new Error("File not found or could not be read.");
                    }
                    return response.text();
                })
                .then((text) => resolve(text))
                .catch((error) => reject(error));
        });
    };

    const getFileName = (elm: string | undefined): string | undefined => {
        return elm?.split("\\").pop();
    };

    return (
        <>
            <aside
                className="menu column is-one-fifth"
                style={{ height: "102vh", overflowY: "auto" }}
            >
                <p className="menu-label">General Tree</p>
                <ul className="menu-list label">
                    {transformedData.map((elm) => (
                        <li key={elm.path}>
                            <TreeItem elm={elm} returnData={handleReturnData} />
                        </li>
                    ))}
                </ul>
            </aside>

            <section className="hero-body p-0">
                <section className="column">
                    <button
                        className="button is-primary m-1"
                        onClick={() =>
                            stringData &&
                            saveAs(
                                new Blob([stringData]),
                                getFileName(data?.path)
                            )
                        }
                    >
                        Save File
                    </button>
                    <textarea
                        className="input textarea hero is-fullheight-with-navbar"
                        value={stringData || ""}
                        onChange={(e) => setStringData(e.target.value)}
                        onBlur={() => setData(null)}
                        onClick={(e) => e.stopPropagation()}
                    ></textarea>
                </section>
            </section>
        </>
    );
}

export default App;
