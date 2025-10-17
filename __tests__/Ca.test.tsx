import { render, screen, fireEvent } from '@testing-library/react'
import { Provider } from 'jotai'

// use the real atom from src/app/components/input to ensure we set the same instance
const { textAreaAtom } = require('../src/app/components/input')

import ScatterPlot from '@/app/components/ca'

const AnyProvider = Provider as any

const renderWithCSV = (csv: string) => {
  const { createStore } = require('jotai')
  const store = createStore()
  store.set(textAreaAtom, csv)
  return render(
    <AnyProvider store={store}>
      <ScatterPlot />
    </AnyProvider>
  )
}

describe('ScatterPlot (ca.tsx)', () => {
  it('renders column names and correlation label for realistic CSV', () => {
    const csv = `国語,地歴公民,数学１,数学２,理科,外国語,情報
165,68,67,75,84,123,78
117,69,81,81,65,115,57
102,52,55,56,93,152,79
160,91,62,68,61,144,98
154,57,67,63,60,167,53
167,57,87,68,59,192,68
197,57,87,84,92,189,74
182,66,81,88,79,106,99
169,97,83,96,79,103,58`

    renderWithCSV(csv)

  // check correlation label exists (may appear multiple times in different elements)
  const corEls = screen.getAllByText(/相関係数/)
  expect(corEls.length).toBeGreaterThan(0)

    // Data Table はデフォルト非表示のため、スイッチを切り替えて表示させる
    const toggle = screen.getByRole('switch')
    fireEvent.click(toggle)

    // 列名（ヘッダ）が UI に表示されることを確認する
    expect(screen.getByText('国語')).toBeInTheDocument()
    expect(screen.getByText('数学１')).toBeInTheDocument()
  })
})
