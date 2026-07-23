import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Divider from '@mui/material/Divider';
import MarkdownRenderer from '../components/MarkdownRenderer.jsx';

const ABOUT_MARKDOWN = `
我是**颜培志**，燕山大学在读研究生，研究方向为**脉冲涡流无损检测（Pulsed Eddy Current, PEC）**。

## 研究方向

- 脉冲涡流信号的建模与特征提取
- 金属构件亚表面缺陷的定量评估
- 基于数据驱动的腐蚀厚度反演

## 关于这个博客

这里记录我的科研笔记、读书心得与生活随笔。欢迎交流指正。

> 知者行之始，行者知之成。
`;

/**
 * Static "About" page describing the blog author.
 */
export default function AboutPage() {
  return (
    <Paper elevation={1} sx={{ p: { xs: 2, sm: 4 } }}>
      <Typography variant="h4" component="h1" gutterBottom>
        关于我
      </Typography>
      <Divider sx={{ mb: 3 }} />
      <Box>
        <MarkdownRenderer content={ABOUT_MARKDOWN} />
      </Box>
    </Paper>
  );
}
