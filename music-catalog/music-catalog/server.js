const express = require('express');
const { Client } = require('@notionhq/client');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

const notion = new Client({
  auth: process.env.NOTION_API_KEY,
});

app.use(cors());
app.use(express.static('public'));
app.use(express.json());

app.get('/api/compositions', async (req, res) => {
  try {
    const response = await notion.databases.query({
      database_id: process.env.NOTION_DATABASE_ID,
    });

    const compositions = response.results.map(page => ({
      id: page.id,
      title: page.properties.Title?.title[0]?.text?.content || 'Untitled',
      genre: page.properties.Genre?.select?.name || 'Unknown',
      price: page.properties.Price?.number || 0,
      description: page.properties.Description?.rich_text[0]?.text?.content || ''
    }));

    res.json(compositions);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Failed to fetch compositions' });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});