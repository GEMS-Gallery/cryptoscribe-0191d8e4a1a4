import React, { useState, useEffect } from 'react';
import { Container, Typography, Button, Card, CardContent, CircularProgress, Modal, Box, TextField } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { Editor } from 'react-draft-wysiwyg';
import { EditorState, convertToRaw, ContentState } from 'draft-js';
import draftToHtml from 'draftjs-to-html';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { backend } from 'declarations/backend';

interface Post {
  id: bigint;
  title: string;
  body: string;
  author: string;
  timestamp: bigint;
}

const App: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [editorState, setEditorState] = useState(EditorState.createEmpty());

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const fetchedPosts = await backend.getPosts();
      setPosts(fetchedPosts);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching posts:', error);
      setLoading(false);
    }
  };

  const handleCreatePost = async () => {
    const content = draftToHtml(convertToRaw(editorState.getCurrentContent()));
    try {
      const result = await backend.createPost(title, content, author);
      if ('ok' in result) {
        setModalOpen(false);
        setTitle('');
        setAuthor('');
        setEditorState(EditorState.createEmpty());
        fetchPosts();
      } else {
        console.error('Error creating post:', result.err);
      }
    } catch (error) {
      console.error('Error creating post:', error);
    }
  };

  return (
    <Container maxWidth="md">
      <Typography variant="h2" component="h1" gutterBottom style={{ marginTop: '2rem' }}>
        Crypto Blog
      </Typography>
      <Button
        variant="contained"
        color="primary"
        startIcon={<AddIcon />}
        onClick={() => setModalOpen(true)}
        style={{ marginBottom: '2rem' }}
      >
        New Post
      </Button>
      {loading ? (
        <CircularProgress />
      ) : (
        posts.map((post) => (
          <Card key={Number(post.id)} style={{ marginBottom: '1rem' }}>
            <CardContent>
              <Typography variant="h5" component="h2">
                {post.title}
              </Typography>
              <Typography color="textSecondary" gutterBottom>
                By {post.author} | {new Date(Number(post.timestamp) / 1000000).toLocaleString()}
              </Typography>
              <Typography variant="body2" component="div" dangerouslySetInnerHTML={{ __html: post.body }} />
            </CardContent>
          </Card>
        ))
      )}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography variant="h6" component="h2" gutterBottom>
            Create New Post
          </Typography>
          <TextField
            fullWidth
            label="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Author"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            margin="normal"
          />
          <Editor
            editorState={editorState}
            onEditorStateChange={setEditorState}
            wrapperClassName="wrapper-class"
            editorClassName="editor-class"
            toolbarClassName="toolbar-class"
          />
          <Button variant="contained" color="primary" onClick={handleCreatePost} style={{ marginTop: '1rem' }}>
            Create Post
          </Button>
        </Box>
      </Modal>
    </Container>
  );
};

export default App;
