import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { ThemeModeProvider } from '../../theme/ThemeModeProvider.jsx';
import HomePage from '../HomePage.jsx';

function renderHome() {
  return render(
    <ThemeModeProvider>
      <MemoryRouter initialEntries={['/']}>
        <HomePage />
      </MemoryRouter>
    </ThemeModeProvider>
  );
}

describe('HomePage', () => {
  it('renders the page heading (brand hero) and the tag cloud entry', () => {
    renderHome();
    // The "大留白Hero" redesign replaced the old "文章列表" section heading
    // with a brand hero title; assert the new intended heading.
    expect(screen.getByText('颜培志 · 博客')).toBeInTheDocument();
    expect(screen.getByText('按标签浏览：')).toBeInTheDocument();
  });

  it('lists a card for every post without crashing', () => {
    renderHome();
    // Each PostCard renders the post title, so their presence proves the
    // cards were rendered from the sorted post list.
    expect(
      screen.getByText('用 Python 提取脉冲涡流信号特征')
    ).toBeInTheDocument();
    expect(
      screen.getByText('脉冲涡流无损检测（PEC-NDT）入门')
    ).toBeInTheDocument();
    expect(screen.getByText('实验室的一天：读研随笔')).toBeInTheDocument();
    expect(
      screen.getByText('基于数据驱动的管道腐蚀厚度反演')
    ).toBeInTheDocument();
  });

  it('shows posts newest-first by surfacing the latest title first in order', () => {
    renderHome();
    const headings = screen
      .getAllByRole('heading', { level: 2 })
      .map((el) => el.textContent);
    // The newest post (2026-07-20) should be the first card title.
    expect(headings[0]).toBe('用 Python 提取脉冲涡流信号特征');
  });
});
