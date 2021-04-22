import React from "react";
import Monaco from "react-monaco-editor";
import { Mode, useLightSwitch } from "use-light-switch";

import Example from "~/../marketing/example";

import code from "./line/code";
import sampleCode from './line/sampleCode';
import simpleLineCode from './line/simpleLine';

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

const Blog = () => {
  const mode = useLightSwitch();
  const dark = mode === Mode.Dark;
  return (
    <div>
      <div className="relative py-16 overflow-hidden bg-white">
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
          <div className="mx-auto mt-6 text-gray-500 prose prose-indigo prose-lg">
            <p>So you want to draw a line.</p>

            <img className={imageClass} src={require("url:./line/1.svg")}></img>

            <p>
              But not just any line! You want a nice line. One with some
              thickness and shading. That means you’ll need to choose every
              pixel around the line, and figure out how far it is from the line.
            </p>

            <img className={imageClass} src={require("url:./line/2.svg")}></img>

            <p>
              You’ll have to do this a lot. Once for every pixel around the
              line. But there are a few different ways of calculating these
              distances. It’s not always the same.
            </p>

            <img className={imageClass} src={require("url:./line/3.svg")}></img>

            <p>
              For this, we’ll need to use a thing called a Vector. A vector
              starts at one point and ends at another. In our setup here, AB is
              a vector between A and B, and AE is a vector from A to E.
            </p>

            <img className={imageClass} src={require("url:./line/4.svg")}></img>

            <p>
              It doesn’t matter where our points are, we can have vectors
              between any two points on a grid. Here’s a whole bunch of them.
            </p>

            <img className={imageClass} src={require("url:./line/5.svg")}></img>

            <p>
              There are two different types of points. Points that are a
              distance from one end, and points that are a distance from the
              line. But how do we know what kind of point we’re dealing with?
              There’s a clever trick! We can use a thing called a Dot Product.
            </p>

            <img className={imageClass} src={require("url:./line/6.svg")}></img>

            <p>
              The Dot Product is a vibe check for vectors. If the vectors are
              going the same way, it’s a positive vibe (positive dot product).
              If they’re going the opposite ways, it’s a negative vibe (negative
              dot product). If the dot is perpendicular, there’s no vibe. The
              dot product is zero.
            </p>
            <img className={imageClass} src={require("url:./line/7.svg")}></img>

            <p>
              You write the dot product using a • and you calculate it using
              this formula:
            </p>

            <pre>AB • AE =  AB.x * AE.x + AB.y * AE.y</pre>

            <img className={imageClass} src={require("url:./line/8.svg")}></img>

            <p>
              We’ll start by checking if the point E is closest to either end of
              the line. if AB•AE is negative, we’re off to the left. If AB•BE is
              positive, we’re off to the right. These are the easiest lengths to
              figure out. We’ll do that next.
            </p>

            <img className={imageClass} src={require("url:./line/9.svg")}></img>

            <p>
              So now that we have AE or BE, we can use pythagoras pretty easily
              becasue we know all the coordinates here. So we can figure out c
              in both these cases. c = sqrt(a2 + b2) in case you forgot
            </p>

            <img
              className={imageClass}
              src={require("url:./line/10.svg")}
            ></img>

            <p>
              If the dot’s in the middle, we have to use a different clever
              trick. We have AE, the vector from A to the point E. And we have
              AB, the vector from A to B. We’re going to get the product of
              these two vectors. It’s not the same as the dot product!
            </p>

            <img
              className={imageClass}
              src={require("url:./line/11.svg")}
            ></img>

            <p>
              What this actually gives us is the area of this parallelogram.
              We’ve multiplied the two sides, and that tells us this gray area.
              Parallelograms work the same way as rectangles. When you calculate
              a rectangle, width and height are both actually vectors.
            </p>

            <img
              className={imageClass}
              src={require("url:./line/12.svg")}
            ></img>

            <p>
              Let’s cut this parallelogram in two and stick it back together.
              Now it’s a rectangle. And we know how to work with rectangles.
              That gray area is the same size as this gray area. Parallelograms
              are neat this way.
            </p>

            <img
              className={imageClass}
              src={require("url:./line/13.svg")}
            ></img>

            <p>
              So if we have the area of the rectangle, and we know the length of
              AB, we can figure out the width really easily. We divide the area
              by the length of AB. And that’s our distance!
            </p>

            <img
              className={imageClass}
              src={require("url:./line/14.svg")}
            ></img>

            <p>
              Now, use the distance as brightness.
              <pre>float brightness = distance / thickness</pre>
            </p>

            <img
              className={imageClass}
              src={require("url:./line/15.svg")}
            ></img>

            <p>
              And there we go! Give every point a brightness that matches its
              distance from the line, and we have a nice blurry line.
            </p>

            <img
              className={imageClass}
              src={require("url:./line/16.svg")}
            ></img>

            <p>Let's try that in C++:</p>

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

            <p>Now, let's see that in a Soulmate sketch!</p>
          </div>

          <div className="px-24 mx-auto mt-6 text-gray-500 prose prose-indigo prose-lg max-w-none">
            <Example className="w-full max-w-10/12" code={simpleLineCode} />
          </div>

          <div className="mx-auto mt-6 text-gray-500 prose prose-indigo prose-lg">
          <p>Not bad at all. But it's a little boring. What if we animated the start and end points?</p>
          </div>

          <div className="px-24 mx-auto mt-6 text-gray-500 prose prose-indigo prose-lg max-w-none">
            <Example className="w-full max-w-10/12" code={code} />
          </div>

        </div>
      </div>
    </div>
  );
};

export default Blog;
