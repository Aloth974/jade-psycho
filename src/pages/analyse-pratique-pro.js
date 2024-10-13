import * as React from "react"
import { Link } from "gatsby"

import Layout from "../components/layout"
import Seo from "../components/seo"

const SecondPage = () => (
  <Layout>
    <h1>Analyse pratique pro</h1>
    <p>TODO</p>
    <Link to="/">Home</Link>
  </Layout>
)

export const Head = () => <Seo title="Analyse pratique pro" />

export default SecondPage
