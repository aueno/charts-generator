import { render, screen, fireEvent } from '@testing-library/react'
import { textAreaAtom } from '@/app/components/input'
import Histogram from '@/app/components/histogram'
import { Provider } from 'jotai'

// テスト用のユーティリティ
// `Provider` にテスト専用の prop (`initialValues`) を渡して atom の初期値を注入する。
// jotai の型定義ではこの prop が定義されていないため、テスト内では any にキャストして使う。
const AnyProvider = Provider as any

// 指定したテキスト（CSV 形式）を atom に注入して Histogram コンポーネントを描画するヘルパー
const renderWithText = (text: string) => {
  return render(
    <AnyProvider initialValues={[[textAreaAtom, text]]}>
      <Histogram />
    </AnyProvider>
  )
}

// Histogram コンポーネントのレンダリングと基本的な挙動を確認するテスト群
describe('Histogram', () => {
  // テスト1: CSV を与えたときに表が描画されることを確認する
  // 検証内容:
  //  - 列ヘッダの「度数」が存在すること
  //  - CSV の値に基づいて少なくとも 1 つのビンにカウント '1' が存在すること
  it('renders table when CSV is provided', () => {
    const csv = 'value\n1\n2\n3\n4\n5'
    renderWithText(csv)
    // ヘッダが描画されていること
    expect(screen.getByText('度数')).toBeInTheDocument()
    // CSV が解析され、ビンのいずれかに '1' が描画されていること
    const ones = screen.getAllByText('1')
    expect(ones.length).toBeGreaterThan(0)
  })

  // テスト2: 階級数（ビン数）を変更すると入力要素の値が更新されることを確認する
  // 検証内容:
  //  - 階級数を表す spinbutton を探し、値を変更した後にその値が反映されること
  it('updates class count when階級数 changes', () => {
    const csv = 'value\n1\n2\n3\n4\n5'
    renderWithText(csv)
    const input = screen.getByRole('spinbutton')
    fireEvent.change(input, { target: { value: '2' } })
    expect(input).toHaveValue(2)
  })
})
