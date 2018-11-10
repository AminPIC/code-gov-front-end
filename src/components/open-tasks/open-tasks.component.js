import React, { Fragment } from 'react'
import { Link } from 'react-router-dom'
import { map, some } from '@code.gov/cautious'
import FilterBox from 'components/filter-box'
import Pagination from 'components/pagination'
import SiteBanner from 'components/site-banner'
import TaskCard from 'components/task-card'
import { scrollToTopOfResults } from 'utils/other'
import { isChecked } from 'utils/filtering'

export default class OpenTasks extends React.Component {

  componentDidMount() {
    const boxes = this.props.boxes || {}
    if (Object.keys(boxes).length === 0) this.props.saveFilterData()
  }

  get counter() {
    const { total } = this.props
    let textContent
    if (total) {
      if (total === 0) {
        textContent = 'There are currently no open tasks'
      } else if (total === 1) {
        textContent = 'There is currently 1 open task'
      } else if (total >= 2) {
        textContent = `There are ${total} open tasks`
      } else {
        textContent = 'Loading Tasks'
      }
    } else {
      textContent = 'Loading Tasks'
    }
    return <h3 className="repos-count width-three-quarters">{textContent}</h3>
  }

  onFilterBoxChange(category, values) {
    scrollToTopOfResults()
    this.props.onFilterBoxChange(category, values)
  }

  updatePage(newPage) {
    scrollToTopOfResults()
    this.props.updatePage(newPage)
  }

  render() {
    const total = this.props.total || 0
    return (
      <div className="search-results-content">
        <SiteBanner title='Open Tasks' />
        <div className="indented">
          <ul className="breadcrumbs">
            <li><Link to="/">Home</Link></li>
            <li>Open Tasks</li>
          </ul>
        </div>
        <div className="search-results-header">
          <div className="width-quarter">
          </div>
          {this.counter}
        </div>
        <div className="indented">
          <div id="filter-boxes-section">
            <h2>Filter</h2>

            {some(this.props.boxes.languages) && (
            <FilterBox title="Language" options={this.props.boxes.languages} onChange={values => this.onFilterBoxChange('languages', values)} />
            )}

            {some(this.props.boxes.agencies) && (
            <FilterBox title="Federal Agency" options={this.props.boxes.agencies} onChange={values => this.onFilterBoxChange('agencies', values)} />
            )}

            {some(this.props.boxes.skillLevels) && (
            <FilterBox title="Skill Level" options={this.props.boxes.skillLevels} onChange={values => this.onFilterBoxChange('skillLevels', values)} />
            )}

            {some(this.props.boxes.timeRequired) && (
            <FilterBox title="Time Required" options={this.props.boxes.timeRequired} onChange={values => this.onFilterBoxChange('timeRequired', values)} />
            )}

            {some(this.props.categories) && (
            <FilterBox title="Type" options={this.categories} onChange={values => this.onFilterBoxChange('categories', values)} />
            )}
          </div>
          <div id="filter-results-section">
            <div className="sort-section">
              <h2>
                <span>Explore Open Tasks</span>
              </h2>
            </div>
            <div className="card-list">
              <div className="card-container">
                <ul className="card-ul">
                  {map(this.props.tasks, task => {
                    return <TaskCard key={task.id} task={task} />
                  })}
                </ul>
              </div>
              {total > 0 && <Pagination count={total} pagesize={this.props.selections.pageSize} page={this.props.selections.page} updatePage={::this.updatePage} />}
            </div>
          </div>
        </div>
      </div>
    )
  }
}