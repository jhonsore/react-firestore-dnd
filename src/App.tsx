import { useReducer } from 'react';
import './App.css';
import DragAndDrop from './components/DragAndDrop';

//-------
// firebase setup
import { initializeApp } from 'firebase/app';
import { getStorage } from "firebase/storage";

import firebaseConfig from "./config/firebase";
import DragAndDropItem, { IDoc } from './components/DragAndDropItem';
const app:any = initializeApp(firebaseConfig);
const storage:any = getStorage(app);
//-------

function App() {
  const reducer = (state:any, action:any) => {
    switch (action.type) {
      case 'SET_DROP_DEPTH':
        return { ...state, dropDepth: action.dropDepth }
      case 'SET_IN_DROP_ZONE':
        return { ...state, inDropZone: action.inDropZone };
      case 'ADD_FILE_TO_LIST':
        const fileList:FileList = state.fileList.concat(action.files);
        return { ...state, fileList};
      case 'REMOVE_ITEM_IN_LIST':
        const newFileList:FileList = state.fileList.filter((file:IDoc, _index: number) => action.index !== _index);
        return { ...state, fileList: newFileList};
      default:
        return state;
    }
  };

  const [data, dispatch] = useReducer(
    reducer, { dropDepth: 0, inDropZone: false, fileList: [], index: undefined }
  );

  function onUpload(doc:IDoc){
    console.log(doc);
  }

  function onRemovedHandler(index:number){
    dispatch({ type: 'REMOVE_ITEM_IN_LIST', index});
  }

  return (
    <div className="App">
      <h1>React drag-and-drop component</h1>
      <DragAndDrop data={data} dispatch={dispatch} />
      <div className="dropped-files">
        {data.fileList.map((f:File, index:number) => {
          return (
            <DragAndDropItem
              index={index}
              folder={'images/'}
              onUpload={onUpload}
              storage={storage}
              key={f.name}
              file={f}
              onRemoved={onRemovedHandler}
            />
          )
        })}
      </div>
    </div>
  );
}

export default App;
