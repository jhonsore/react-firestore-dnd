import { FC } from "react";

interface IDragAndDrop {
    data: any;
    dispatch: any;
}

const DragAndDrop:FC<IDragAndDrop> = (props) => {
    const { data, dispatch } = props;

  const handleDragEnter = (e:React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();

    dispatch({ type: 'SET_DROP_DEPTH', dropDepth: data.dropDepth + 1 });

  };
  const handleDragLeave = (e:React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();

    dispatch({ type: 'SET_DROP_DEPTH', dropDepth: data.dropDepth - 1 });
    if (data.dropDepth > 0) return
    dispatch({ type: 'SET_IN_DROP_ZONE', inDropZone: false })
  };
  const handleDragOver = (e:React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    e.dataTransfer.dropEffect = 'copy';
    dispatch({ type: 'SET_IN_DROP_ZONE', inDropZone: true });
  };
  const handleDrop = (e:React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    const _files:any = e.dataTransfer.files;
    let files = [..._files];
  
    if (files && files.length > 0) {
        const existingFiles = data.fileList.map((f:File) => f.name)
        files = files.filter(f => !existingFiles.includes(f.name))
        
        dispatch({ type: 'ADD_FILE_TO_LIST', files });
        //e.dataTransfer.clearData();
        dispatch({ type: 'SET_DROP_DEPTH', dropDepth: 0 });
        dispatch({ type: 'SET_IN_DROP_ZONE', inDropZone: false });
    }
  };
  return (
    <div className={data.inDropZone ? 'drag-drop-zone inside-drag-area' : 'drag-drop-zone'}
      onDrop={e => handleDrop(e)}
      onDragOver={e => handleDragOver(e)}
      onDragEnter={e => handleDragEnter(e)}
      onDragLeave={e => handleDragLeave(e)}
    >
      <p>Drag files here to upload</p>
    </div>
  );
};
export default DragAndDrop;
