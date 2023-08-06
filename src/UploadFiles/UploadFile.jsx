import React, { useState } from 'react'
const OAuth ='OAuth '
const token = ''// ввести свой авторизационнный токен
const authorizationToken =OAuth+token 
const url = "https://cloud-api.yandex.net/v1/disk/resources/upload?path=" 
export default function UploadFiles() {
    const [filesData,setFilesData] = useState(null) 
    const handleChooseFile = (event)=>{ 
        setFilesData(event.target.files) //сетаем массив из файлов в filesData
    } 
    const handleRequestADownloadURL = async () => {// создаем асинхронную функцию для загрузки файла
      if (filesData!==null && filesData.length >= 1 && filesData.length <= 100) {//условие загрузки от 1 до 100 файлов
        try {
          for (let i = 0; i < filesData.length; i++) {
            const name = filesData[i].name;
            const path = encodeURIComponent(name);
            const createOptions = {
              method: 'GET',
              headers: {
                Authorization: authorizationToken
              }
            };
            const response = await fetch(`${url}${path}&overwrite=true`, createOptions); // получаем объект Response, который содержит ответ от сервера,если файл существет то перезаписываем его(overwrite=true)
            const createData = await response.json();//получаем тело ответа асионхронным методом json(объекта Response)
            if (response.ok && createData.href) {//проверяем: запрос был успешен и в теле ответа есть свойство href(url для загрузки)
              const downloadUrl = createData.href;
              const uploadOptions = {
                method: 'PUT',
                headers: {
                  'Content-Type': filesData[i].type
                },
                body: filesData[i]
              };
              await fetch(downloadUrl, uploadOptions);//делаем PUT запрос для загрузки файла по полученному url
              console.log('Файл успешно загружен');
            }
          }
        } catch (error) {
          console.error('Ошибка загрузки файла:', error);
        }
      } else {
        alert('Выберите от 1 до 100 файлов');
      }
    };
    return (
        <div>
            <input type="file" accept="*" multiple="multiple"  onChange={handleChooseFile} />
        <button onClick={handleRequestADownloadURL}>Загрузка на Yadisk</button>
        </div>
        )
}
