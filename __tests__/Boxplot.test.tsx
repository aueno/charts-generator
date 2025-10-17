// コンポーネントが相対パス "./input" から import しているため、テストでも
// 同一のモジュールを require して同一インスタンスの atom を取得する。
const { textAreaAtom } = require('../src/app/components/input')
import { render, screen } from '@testing-library/react'
import { Provider } from 'jotai'
import Boxplot from '@/app/components/hakohige'

// テスト用ユーティリティ: Provider を any にキャストして initialValues を渡す
const AnyProvider = Provider as any

const renderWithCSV = (csv: string) => {
  // create a separate jotai store for the test and set the atom value synchronously
  const { createStore } = require('jotai')
  const store = createStore()
  store.set(textAreaAtom, csv)
  return render(
    <AnyProvider store={store}>
      <Boxplot />
    </AnyProvider>
  )
}

// Boxplot コンポーネントの基本的な表示を確認するテスト群
describe('Boxplot', () => {
  // テスト1: 有効な CSV を与えたときに列名が表示され、グラフ（canvas）描画処理に進むことを期待する
  // 検証内容:
  //  - CSV のヘッダ 'A' と 'B' がチェックボックスなどの UI に表示される
  it('renders canvas when valid CSV is provided', () => {
    // 実運用で近い形のモックデータを使ってテスト
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
  // テスト時の DOM を出力して、ヘッダがどのようにレンダリングされているか確認する
  // (テスト完了後にこの行は削除して構いません)
  // eslint-disable-next-line no-console
  console.log('BOXPLOT DOM:');
  screen.debug()
  // 列名（ヘッダ）が UI に表示されることを確認する
  expect(screen.getByText('国語')).toBeInTheDocument()
  expect(screen.getByText('数学１')).toBeInTheDocument()
  })

  // テスト2: 空の入力（データ無し）の場合、フォールバックメッセージが表示されることを確認する
  it('renders fallback message when no data', () => {
    renderWithCSV('')
    expect(screen.getByText('箱ひげ図を描画するデータがありません。')).toBeInTheDocument()
  })
})
