import { FC, MouseEvent } from "react";
import { ref, uploadBytesResumable, getDownloadURL,  } from "firebase/storage";
import { bytesToSize } from '../utils/bytesToSize';
import getFileExtension from "../utils/getFileExtension";
import guid from "../utils/guid";
import { useEffect } from "react";
import { useState } from "react";

interface IDragAndDropItem {
    file:File;//file instance
    storage:any;// firebase storage instance
    onUpload: (doc:IDoc) => void;//invoked when image is uploaded
    folder?:string;//path with / -> ex.: images/
    onRemoved?:(index:number, file?:File) => void;
    index:number;
}

export interface IDoc {
    nome:string;
    url:string;
    extensao:string;
    tamanho:string;
}

const DragAndDropItem:FC<IDragAndDropItem> = (props) => {
    const { file, storage, onUpload, folder, index, onRemoved } = props;
    const [totalBytes, setTotalBytes] = useState<string>('');
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        upload();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    //--------
    // upload file
    async function upload(){
        const filename:string = guid();
        const ext:string = getFileExtension(file.name);
        const storageRef = ref(storage, `${folder}${filename}.${ext}`);
        const fileSize:string = bytesToSize(file.size);
        setTotalBytes(fileSize);
        try {
            const uploadTask = uploadBytesResumable(storageRef, file);
            
            uploadTask.on('state_changed', 
            (snapshot) => {
                // Observe state change events such as progress, pause, and resume
                // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
                const _progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                setProgress(_progress);
            }, 
            (error) => {
                // Handle unsuccessful uploads
            }, 
            async () => {
                // Handle successful uploads on complete
                uploadDone({uploadTask});
            }
            );
        } catch (error) {
            console.log(error);
        }
    }
    async function uploadDone(args:{uploadTask:any}){
        const {uploadTask} = args;
        const ext:string = getFileExtension(file.name);
        const downloadURL:string = await getDownloadURL(uploadTask.snapshot.ref);
        const doc:IDoc = {
            nome: file.name,
            url:downloadURL,
            extensao:ext,
            tamanho: totalBytes
        }
        onUpload(doc);
    }
    //--------

    function onRemoveHandler(event: MouseEvent<HTMLButtonElement>){
        event.preventDefault();
        if(onRemoved) onRemoved(index, file);
    }

    return <div className="dropped-file">
        <span className="dropped-file__name">{file.name} ({totalBytes})</span>
        <span className="progress-bar">
            <span className="progress-bar__bar" style={{width: `${progress}%`}}></span>
        </span>
        <button onClick={onRemoveHandler}>x</button>
    </div>
}

export default DragAndDropItem;