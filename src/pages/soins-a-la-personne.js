import * as React from "react"
import { Link } from "gatsby"

import Layout from "../components/layout"
import Seo from "../components/seo"

const SecondPage = () => (
  <Layout>
    <h1>Soins à la personne</h1>
    <p>TODO</p>
    <Link to="/">Home</Link>
  </Layout>
)

export const Head = () => <Seo title="Soins à la personne" />

export default SecondPage
