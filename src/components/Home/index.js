import {Component} from 'react'

import Loader from 'react-loader-spinner'

import Header from '../Header'
import ListCard from '../ListCard'

import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class Home extends Component {
  state = {
    selectOp: 'ALL',
    apiStatus: apiStatusConstants.initial,
    dataList: [],
  }

  componentDidMount() {
    this.getData()
  }

  getFetchData = data => ({
    id: data.id,
    imageUrl: data.image_url,
    name: data.name,
  })

  getData = async () => {
    this.setState({apiStatus: apiStatusConstants.inProgress})

    const {selectOp} = this.state
    const apiUrl = `https://apis.ccbp.in/ps/projects?category=${selectOp}`
    const options = {
      method: 'GET',
    }
    const response = await fetch(apiUrl, options)
    if (response.ok) {
      const fetchData = await response.json()
      const updated = fetchData.projects.map(each => this.getFetchData(each))
      this.setState({dataList: updated, apiStatus: apiStatusConstants.success})
    } else {
      this.setState({
        apiStatus: apiStatusConstants.failure,
      })
    }
  }

  onChangeSelect = event => {
    this.setState({selectOp: event.target.value}, this.getData)
  }

  renderLoadingView = () => (
    <div data-testid="loader">
      <Loader type="loader" color="#328af2" height={50} width={50} />
    </div>
  )

  renderFailureView = () => (
    <div className="failure-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/projects-showcase/failure-img.png"
        alt="failure view"
        className="failure-img"
      />
      <h1>Oops! Something Went Wrong</h1>
      <p>We cannot seem to find the page you are looking for.</p>
      <button type="button" className="button" onClick={this.getData}>
        Retry
      </button>
    </div>
  )

  renderSuccessView = () => {
    const {dataList} = this.state

    return (
      <ul className="success-list">
        {dataList.map(eachItem => (
          <ListCard key={eachItem.id} details={eachItem} />
        ))}
      </ul>
    )
  }

  renderResult = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderSuccessView()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      case apiStatusConstants.inProgress:
        return this.renderSuccessView()
      default:
        return null
    }
  }

  render() {
    const {categoriesList} = this.props
    const {selectOp} = this.state

    return (
      <>
        <Header />
        <ul className="ul-list">
          <select
            className="select-container"
            value={selectOp}
            onChange={this.onChangeSelect}
          >
            {categoriesList.map(eachCategory => (
              <option value={eachCategory.id} key={eachCategory.id}>
                {eachCategory.displayText}
              </option>
            ))}
          </select>
        </ul>
        {this.renderResult()}
      </>
    )
  }
}

export default Home
