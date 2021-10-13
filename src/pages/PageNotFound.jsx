import React from 'react'
import "../assets/css/pagenotfound.css";

const PageNotFound = () => {
    return (
        <>
            <h1>404</h1>
            <p>Oops! Something is wrong.</p>
            <a className="button" href="/"><i className="icon-home"></i> Go back in initial page, is better.</a>
        </>)
}

export default PageNotFound
