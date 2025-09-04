import React from "react"

const TLEData = ({ issTle }) => {
return(
    <div className="data-card">
        <h2>TLE Data</h2>
        <p className="tle-text">
          <strong>Line 1:</strong> {issTle.line1 || '1 25544U 98067A   24072.45833333  .00020674  00000-0  37224-3 0  9997'}<br />
          <strong>Line 2:</strong> {issTle.line2 || '2 25544  51.6404  55.9163 0001727  26.6688  64.1273 15.49970316443794'}
        </p>
      </div>
)
}
export default TLEData;