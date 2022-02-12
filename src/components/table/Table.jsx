import React, { useState } from "react";
import "./table.css";

const Table = (props) => {
  const initDataShow = props.limit && props.bodyData.length>0 ? props.bodyData.slice(0, Number(props.limit)) : props.bodyData;
  const [dataShow, setDataShow] = useState(initDataShow);
  let pages = 1;
  let range = [];
 

  if (props.limit !== undefined) {
    let page = Math.floor(props.bodyData.length>0 && props.bodyData.length / Number(props.limit));
    pages = props.bodyData.length>0 && props.bodyData.length % Number(props.limit) === 0 ? page : page + 1;
    range = [...Array(pages).keys()];
  }

  const [currPage, setCurrPage] = useState(0);

  const selectPage = (page) => {
    const start = Number(props.limit) * page;
    const end = start + Number(props.limit);
    setDataShow(props.bodyData.slice(start, end));
    setCurrPage(page);
  };

  return (
    <div>
      <div className="table-wrapper">
        <table>
          {props.headData && (
            <thead>
              <tr>
                {props.headData.map((item, index) =>
                  props.renderHead(item, index)
                )}
              </tr>
            </thead>
          )}
          {props.bodyData.length>0 ? (
            <tbody>
              {currPage < 1
                ? initDataShow.map((item, index) =>
                    props.renderBody(item, index)
                  )
                : dataShow.map((item, index) => props.renderBody(item, index))}
            </tbody>
          ): <span>Ничего нет</span>}
        </table>
      </div>
      {pages > 1 && (
        <div className="table__pagination">
          {range.map((item, index) => (
            <div
              key={index}
              className={`table__pagination-item ${
                currPage === index ? "active" : ""
              }`}
              onClick={() => selectPage(index)}
            >
              {item + 1}
            </div>
          ))}
        </div>
      ) }
    </div>
  );
};

export default Table;
