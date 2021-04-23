import React, { useLayoutEffect } from "react";
import Monaco from "react-monaco-editor";
import { Mode, useLightSwitch } from "use-light-switch";

import Example from "~/../marketing/example";

import code from "./line/code";
import sampleCode from "./line/sampleCode";
import simpleLineCode from "./line/simpleLine";
import triangle from "./line/triangle";

const blue = { fontStyle: 'italic', color: "rgb(1, 1, 250)" };
const orange = { fontStyle: 'italic', color: "rgb(234, 163, 39" };
const green = { fontStyle: 'italic', color: "rgb(73, 128, 31" };
const red = { fontStyle: 'italic', color: "rgb(219, 5, 2" };

const editorConfig = {
  links: false,
  language: "soulmate",
  scrollBeyondLastLine: false,
  tabSize: 2,
  lineNumbers: true,
  showFoldingControls: true,
  folding: true,
  glyphMargin: false,
  minimap: {
    enabled: false,
  },
};

const imageClass = "mx-auto w-full";
const pClass = "";

const Blog = () => {
  const mode = useLightSwitch();
  const dark = mode === Mode.Dark;

  useLayoutEffect(() => {
    const targets = document.querySelectorAll(
      ".soulmate-content > p, .soulmate-content > img, .soulmate-content > div, .soulmate-content > pre"
    );
    const callback = function (entries) {
      const fadeEntries = [];
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          fadeEntries.push(entry);
        } else if (entry.boundingClientRect.top > 0) {
          // entry.target.classList.remove("motion-safe:animate-fadeIn");
        }
      });

      fadeEntries.forEach((fadeEntry, i) => {
        setTimeout(() => {
          fadeEntry.target.classList.add("motion-safe:animate-fadeIn");
        }, i * 100);
      });
    };
    const observer = new IntersectionObserver(callback);
    targets.forEach(function (target) {
      target.classList.add("opacity-0");
      observer.observe(target);
    });
  }, []);

  return (
    <div>
      <div className="relative py-16 overflow-hidden bg-white soulmate-content">
        <div className="relative px-4 sm:px-6 lg:px-8">
          <div className="mx-auto text-lg max-w-prose">
            <h1>
              <span className="block text-base font-semibold tracking-wide text-indigo-600 uppercase">
                LEDs and Linear Algebra
              </span>
              <span className="block mt-2 text-3xl font-extrabold tracking-tight text-gray-900 leading-8 sm:text-4xl">
                Drawing a line
              </span>
            </h1>
          </div>
          <div className="mx-auto mt-6 text-gray-500 soulmate-content prose prose-indigo prose-lg">
            <p className={pClass}>So you want to draw a line.</p>

            <img className={imageClass} src={require("url:./line/1.svg")}></img>

            <p className={pClass}>
              But not just any line! You want a nice line. One with some
              thickness and shading. That means you’ll need to choose every
              pixel around the line, and figure out how far it is from the line.
            </p>

            <img className={imageClass} src={require("url:./line/2.svg")}></img>

            <p className={pClass}>
              You’ll have to do this a lot. Once for every pixel around the
              line. But there are a few different ways of calculating these
              distances. It’s not always the same:
            </p>

            <img className={imageClass} src={require("url:./line/3.svg")}></img>

            <p className={pClass}>
              For this, we’ll need to use a thing called a Vector. A vector
              starts at one point and ends at another. In our setup here, AB is
              a vector between A and B, and <span style={green}>AE</span> is a
              vector from A to E.
            </p>

            <img className={imageClass} src={require("url:./line/4.svg")}></img>

            <p className={pClass}>
              It doesn’t matter where our points are, we can have vectors
              between any two points on a grid. Here’s a whole bunch of them:
            </p>

            <img className={imageClass} src={require("url:./line/5.svg")}></img>

            <p className={pClass}>
              There are two different types of points.{" "}
              <span style={orange}>
                Points that are a distance from one end
              </span>
              , and{" "}
              <span style={blue}>points that are a distance from the line</span>
              .
            </p>

            <img className={imageClass} src={require("url:./line/6.svg")}></img>

            <p className={pClass}>
              But how do we know what kind of point we’re dealing with? There’s
              a clever trick! We can use a thing called a Dot Product.
            </p>
            <p className={pClass}>
              The Dot Product is a vibe check for vectors. If the vectors are
              going the <span style={green}>same way</span>, it’s a <span style={green}>
                positive
                vibe
              </span> (positive dot product). If they’re going the{" "}
              <span style={red}>opposite ways</span>, it’s a negative vibe
              (negative dot product). If the dot is{" "}
              <span style={blue}>perpendicular</span>, there’s no vibe. The dot
              product is zero.
            </p>
            <img className={imageClass} src={require("url:./line/7.svg")}></img>

            <p className={pClass}>
              You write the dot product using the • symbol, and you calculate it
              using this formula:
            </p>

            <pre>
              <span style={green}>AB</span> • <span style={orange}>AE</span> = 
              <span style={green}>AB</span>.x * <span style={orange}>AE</span>.x
              + <span style={green}>AB</span>.y * <span style={orange}>AE</span>
              .y
            </pre>

            <img className={imageClass} src={require("url:./line/8.svg")}></img>

            <p className={pClass}>
              We’ll start by checking if the point <span style={red}>E</span> is
              closest to either end of the line. if{" "}
              <span style={green}>AB</span>•<span style={orange}>AE</span> is
              negative, we’re off to the left. If <span style={green}>AB</span>•
              <span style={orange}>BE</span> is positive, we’re off to the
              right. These are the easiest lengths to figure out. We’ll do that
              next.
            </p>

            <img className={imageClass} src={require("url:./line/9.svg")}></img>

            <p className={pClass}>
              So now that we have <span style={orange}>AE</span> or{" "}
              <span style={orange}>BE</span>, we can use pythagoras pretty
              easily since we know all the coordinates here.
            </p>

            <img className={imageClass} src={require("url:./line/10.svg")} />

            <p className={pClass}>
              So we can figure out c in both these cases:
            </p>

            <pre>
              c = sqrt(a<sup>2</sup> + b<sup>2</sup>)
            </pre>

            <p className={pClass}>
              If the dot’s in the middle, we have to use a different clever
              trick. We have <span style={orange}>AE</span>, the vector from A
              to the point E. And we have <span style={green}>AB</span>, the
              vector from A to B. We’re going to get the product of these two
              vectors. It’s not the same as the dot product!
            </p>

            <img
              className={imageClass}
              src={require("url:./line/11.svg")}
            ></img>

            <p className={pClass}>
              What this actually gives us is the area of this parallelogram.
              We’ve multiplied the two sides, and that tells us this gray area.
              Parallelograms work the same way as rectangles. When you calculate
              a rectangle, width and height are both actually vectors.
            </p>

            <img
              className={imageClass}
              src={require("url:./line/12.svg")}
            ></img>

            <p className={pClass}>
              Let’s cut this parallelogram in two and stick it back together.
              Now it’s a rectangle. And we know how to work with rectangles.
              That gray area is the same size as this gray area. Parallelograms
              are neat this way.
            </p>

            <img
              className={imageClass}
              src={require("url:./line/13.svg")}
            ></img>

            <p className={pClass}>
              So if we have the area of the rectangle, and we know the length of
              AB, we can figure out the <span style={blue}>width</span> really
              easily. We divide the area by the length of AB. And that’s our
              distance!
            </p>

            <img
              className={imageClass}
              src={require("url:./line/14.svg")}
            ></img>

            <p className={pClass}>
              Now, use the distance as brightness.
              <pre>float brightness = distance / thickness</pre>
            </p>

            <img
              className={imageClass}
              src={require("url:./line/15.svg")}
            ></img>

            <p className={pClass}>
              And there we go! We now know how to calculate the distance of any
              point from this line. If the dot product is 0, use that area
              division thing. If it's 0, use Pythagoras.
            </p>

            <p className={pClass}>
              Then, give every point a brightness that matches its distance from
              the line, and we have a nice blurry line.
            </p>

            <img
              className={imageClass}
              src={require("url:./line/16.svg")}
            ></img>

            <p className={pClass}>Let's try that in C++:</p>

            <div className="w-full border border-red" style={{ height: 640 }}>
              <Monaco
                className="h-40"
                key={dark ? "dark" : "light"}
                options={{
                  ...editorConfig,
                  value: sampleCode,
                  theme: dark ? "vs-dark" : "vs-light",
                }}
              />
            </div>

            <p className={pClass}>
              Pretty good. Now let's see that in a Soulmate sketch!
            </p>
          </div>

          <div className="px-24 mx-auto mt-6 text-gray-500 prose prose-indigo prose-lg max-w-none soulmate-content">
            <Example className="w-full max-w-10/12" code={simpleLineCode} />
          </div>

          <div className="mx-auto mt-6 text-gray-500 prose prose-indigo prose-lg">
            <p className={pClass}>Not bad at all. But it's a little boring.</p>

            <p className={pClass}>
              What if we animated the start and end points?
            </p>
          </div>

          <div className="px-24 mx-auto mt-6 text-gray-500 prose prose-indigo prose-lg max-w-none soulmate-content">
            <Example className="w-full max-w-10/12" code={code} />
          </div>

          <div className="mx-auto mt-6 text-gray-500 prose prose-indigo prose-lg">
            <p className={pClass}>
              At the bottom of that last sketch, you can see these lines:
            </p>

            <pre className="whitespace-pre">{`Point start(
  beatsin16(10, 0, 8),
  beatsin16(11, 0, 8)
);
Point stop(
  beatsin16(12, ROWS - 8, ROWS),
  beatsin16(13, COLS - 8, COLS)
);`}</pre>
            <p className={pClass}>
              Those <span>beatsin16</span> functions call a sine wave every time
              they're rendered.
            </p>

            <pre className="whitespace-pre">
              beatsin16(beatsPerMinute, start, end)
            </pre>

            <p className={pClass}>
              Now, if you can draw a line, you can draw anything!
            </p>
          </div>

          <div className="px-24 mx-auto mt-6 text-gray-500 prose prose-indigo prose-lg max-w-none soulmate-content">
            <Example className="w-full max-w-10/12" code={triangle} />
          </div>

          <div className="mx-auto mt-6 text-gray-500 prose prose-indigo prose-lg">
            <p className={pClass}>
              Well, that's all I have for you today. I hope you found this interesting.
              I've had a lot of fun doing vector algebra and drawing things. I've remembered stuff about matrices and vectors
              and Pythagoras.
            </p>

            <p className={pClass}>
              If you think this was fun, you might like the <a href="https://editor.soulmatelights.com/">Soulmate IDE</a> that I've made. It's a tool for programming LEDs and turning math into art.
            </p>

            <p className={pClass}>
              Elliott
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Blog;
