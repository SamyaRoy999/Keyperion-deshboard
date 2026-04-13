"use client";
import Heading from "@/components/reuseable/heading";
import TextEditor from "@/components/reuseable/text-editor";
import React, { useState } from "react";


export default function Privacy() {
    const [content, setContent] = useState<string>("");
 
  return (
    <div className="wapper">
      <div className="card">
        <Heading
          title="Privacy Policy"
          text="Admin can edit privacy policy"
        />
        <div className="pt-10 pb-5">
          <TextEditor value={content} onChange={setContent} />
        </div>
      </div>

    </div>
  );
}
