import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';

import filesize from 'filesize';

import { cachedDataVersionTag } from 'v8';
import Header from '../../components/Header';
import FileList from '../../components/FileList';
import Upload from '../../components/Upload';

import { Container, Title, ImportFileContainer, Footer } from './styles';

import alert from '../../assets/alert.svg';
import api from '../../services/api';

interface FileProps {
  file: File;
  name: string;
  readableSize: string;
}

const Import: React.FC = () => {
  const [uploadedFiles, setUploadedFiles] = useState<FileProps[]>([]);
  const [msgRetorno, setMsgRetorno] = useState('');
  const history = useHistory();

  async function handleUpload(): Promise<void> {
    const data = new FormData();

    if (uploadedFiles.length <= 0) {
      setMsgRetorno('Nenhum arquivo carregado!');
      return;
    }
    const file = uploadedFiles[0];
    data.append('file', file.file);

    try {
      await api.post('/transactions/import', data);
      setMsgRetorno('Enviado com sucesso!');
    } catch (err) {
      setMsgRetorno('Ocorreu uma falha ao realizar o upload do arquivo!');
    }
  }

  function submitFile(files: File[]): void {
    setMsgRetorno('');
    const filesUpload = files.map(file => ({
      file,
      name: file.name,
      readableSize: filesize(file.size),
    }));

    setUploadedFiles(filesUpload);
  }

  return (
    <>
      <Header size="large" />
      <Container>
        <Title>Importar uma transação</Title>
        <ImportFileContainer>
          <Upload onUpload={submitFile} />
          {!!uploadedFiles.length && <FileList files={uploadedFiles} />}

          <Footer>
            <p>
              <img src={alert} alt="Alert" />
              Permitido apenas arquivos CSV
            </p>
            <button onClick={handleUpload} type="button">
              Enviar
            </button>
          </Footer>
          {msgRetorno && <span>{msgRetorno}</span>}
        </ImportFileContainer>
      </Container>
    </>
  );
};

export default Import;
