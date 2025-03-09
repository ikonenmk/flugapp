import {NavLink} from "react-router-dom";
import "./about.css";
import creator from './creator.png';
export default function About() {
    return (
        <>
            <div className="rubric">
                <h1>About</h1>
            </div>
            <div className="text-container">
                <div className="about-text">
                    <p>Everyone who has bought material for tying a certain fly pattern knows how small an amount of
                        each
                        material you actually end up using for tying that specific pattern. After tying a couple of
                        patterns, you don’t only have a few new flies, but also a lot of unused fly tying material.</p>

                    <p><i>What patterns could I use all this material for…?</i></p>

                    <p>That’s the question that motivated the creation of this site. The idea was to provide fly tiers
                        with
                        a tool to search for fly patterns based on a selection of fly tying materials.
                    </p>

                    <p>By adding materials in the material field of the <NavLink to="/">search function</NavLink>, you
                        can
                        filter all patterns that have been added to the pattern database. It is also possible to filter
                        on
                        pattern names or on which fish species you want to target. If you find a style of tying that
                        appeals
                        to you, it is also possible to search for all flies tied by that creator.</p>

                    <p>If you <NavLink to="/register">create</NavLink> an account on the site, you will be able to save
                        flies that you want to remember in your <NavLink to="/library">personal library</NavLink> .</p>

                    <p>With an account you can also use the <NavLink to="/create">upload</NavLink> function to share
                        your
                        own fly patterns.</p>

                    <p>Flyxicon is dedicated to the fly tying community only and <b>completely not-for-profit</b>. The
                        content uploaded by users will not be sold or used to make money in any way.</p>

                    <p> If you have any questions or suggestions about improvements to the site, don't hesitate to send
                        an
                        email to <a href="mailto:flyxicon@gmail.com">flyxicon@gmail.com</a></p>

                    <p>Tight lines!</p>
                    <img src={creator} className="creator-image" alt="image of site creator"/>
                    <figcaption>Markus Ikonen Karlström</figcaption>
                    <i>Creator of Flyxicon.com</i>
                </div>
            </div>

        </>
    );
}