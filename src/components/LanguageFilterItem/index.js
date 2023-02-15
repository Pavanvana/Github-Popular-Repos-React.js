// Write your code here
import './index.css'

const LanguageFilterItem = props => {
  const {isActive, languageDetails, updateActiveTabId} = props
  const {id, language} = languageDetails
  const btnClassName = isActive
    ? 'language-btn active-language-btn'
    : 'language-btn'

  const onClickTab = () => {
    updateActiveTabId(id)
  }

  return (
    <li className="tab-item">
      <button type="button" className={btnClassName} onClick={onClickTab}>
        {language}
      </button>
    </li>
  )
}
export default LanguageFilterItem
