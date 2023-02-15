import {Component} from 'react'
import Loader from 'react-loader-spinner'
import LanguageFilterItem from '../LanguageFilterItem'
import RepositoryItem from '../RepositoryItem'
import './index.css'

const languageFiltersData = [
  {id: 'ALL', language: 'All'},
  {id: 'JAVASCRIPT', language: 'Javascript'},
  {id: 'RUBY', language: 'Ruby'},
  {id: 'JAVA', language: 'Java'},
  {id: 'CSS', language: 'CSS'},
]

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

// Write your code here
class GithubPopularRepos extends Component {
  state = {
    activeTabId: languageFiltersData[0].id,
    repositoriesData: [],
    apiStatus: apiStatusConstants.initial,
  }

  componentDidMount = () => {
    this.getRepositories()
  }

  getRepositories = async () => {
    const {activeTabId} = this.state
    this.setState({apiStatus: apiStatusConstants.inProgress})
    const url = `https://apis.ccbp.in/popular-repos?language=${activeTabId}`
    const response = await fetch(url)
    if (response.ok) {
      const data = await response.json()
      const updatedData = data.popular_repos.map(eachRepository => ({
        id: eachRepository.id,
        imageUrl: eachRepository.avatar_url,
        name: eachRepository.name,
        starsCount: eachRepository.stars_count,
        forksCount: eachRepository.forks_count,
        issuesCount: eachRepository.issues_count,
      }))
      this.setState({
        repositoriesData: updatedData,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  updateActiveTabId = id => {
    this.setState({activeTabId: id}, this.getRepositories)
  }

  renderSuccessView = () => {
    const {repositoriesData} = this.state
    return (
      <ul className="repositories-list">
        {repositoriesData.map(eachRepo => (
          <RepositoryItem key={eachRepo.id} repositoryDetails={eachRepo} />
        ))}
      </ul>
    )
  }

  renderFailureView = () => (
    <div className="failure-view-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/api-failure-view.png"
        alt="failure view"
        className="failure-view-image"
      />
      <h1 className="error-message">Something Went Wrong</h1>
    </div>
  )

  renderInProgressView = () => (
    <div data-testid="loader">
      <Loader color="#0284c7" height={80} type="ThreeDots" width={80} />
    </div>
  )

  renderRepositories = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderSuccessView()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      case apiStatusConstants.inProgress:
        return this.renderInProgressView()
      default:
        return null
    }
  }

  render() {
    const {activeTabId} = this.state
    return (
      <div className="app-container">
        <div className="repo-container">
          <h1 className="heading">Popular</h1>
          <ul className="tabs-container">
            {languageFiltersData.map(eachLanguage => (
              <LanguageFilterItem
                key={eachLanguage.id}
                languageDetails={eachLanguage}
                updateActiveTabId={this.updateActiveTabId}
                activeTabId={activeTabId}
                isActive={eachLanguage.id === activeTabId}
              />
            ))}
          </ul>
          {this.renderRepositories()}
        </div>
      </div>
    )
  }
}
export default GithubPopularRepos
