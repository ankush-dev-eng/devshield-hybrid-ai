export interface CodeSample {
  id: string;
  name: string;
  language: string;
  description: string;
  code: string;
}

export const SAMPLE_CODES: CodeSample[] = [
  {
    id: 'express-stripe-sql',
    name: 'Node.js Express — Stripe Key, SQLi, SSRF & Path Traversal',
    language: 'javascript',
    description: 'Realistic backend API leaking production Stripe tokens, susceptible to SQL Injection, SSRF, and arbitrary file reads.',
    code: `const express = require('express');
const mysql = require('mysql2/promise');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const axios = require('axios');

const app = express();
app.use(express.json());

// CRITICAL: Hardcoded API secret key exposed in source code (CWE-798)
const STRIPE_SECRET_KEY = "sk_test_51M0DEMOSTRIPESECRETKEY9999999999999";
const JWT_SECRET = "supersecret_company_master_key_123!";

const db = mysql.createPool({ host: 'localhost', user: 'root', database: 'production_db' });

// Vulnerable endpoint: SQL Injection via unsanitized template literal (CWE-89)
app.get('/api/users/search', async (req, res) => {
  const { query } = req.query;
  const sql = \`SELECT id, username, email, credit_card FROM users WHERE username = '\${query}'\`;
  const [rows] = await db.execute(sql);
  res.json(rows);
});

// CWE-918: Server-Side Request Forgery (SSRF) via unvalidated external fetch
app.get('/api/proxy-avatar', async (req, res) => {
  const { url } = req.query;
  const response = await axios.get(url); // Can probe 169.254.169.254 metadata
  res.send(response.data);
});

// CWE-22: Path Traversal allowing arbitrary file read
app.get('/api/docs/view', (req, res) => {
  const { filename } = req.query;
  const content = fs.readFileSync(\`/var/www/uploads/\${filename}\`, 'utf-8');
  res.send(content);
});

// Insecure JWT signing without expiration (CWE-321)
app.post('/api/login', (req, res) => {
  const { userId } = req.body;
  const token = jwt.sign({ id: userId, role: 'admin' }, JWT_SECRET);
  res.json({ token });
});

app.listen(3000, () => console.log('Server started on port 3000'));
`
  },
  {
    id: 'python-aws-rce',
    name: 'Python FastAPI — AWS Key Leak, Command Injection & Insecure Pickle',
    language: 'python',
    description: 'Microservice with hardcoded AWS root secrets, shell command injection, and remote code execution via pickle deserialization.',
    code: `import os
import subprocess
import pickle
import base64
from fastapi import FastAPI, HTTPException

app = FastAPI()

# CRITICAL: AWS Production Credentials leaked in source code (CWE-798)
AWS_ACCESS_KEY_ID = "AKIAIOSFODNN7EXAMPLE"
AWS_SECRET_ACCESS_KEY = "wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY"
AWS_REGION = "us-east-1"

@app.get("/system/ping")
def ping_host(host: str):
    # CWE-78: OS Command Injection via shell=True with unvalidated user input
    command = f"ping -c 1 {host}"
    output = subprocess.check_output(command, shell=True, text=True)
    return {"result": output}

@app.post("/session/restore")
def restore_user_session(payload: str):
    # CWE-502: Insecure Deserialization via pickle (Arbitrary Python RCE)
    raw_data = base64.b64decode(payload)
    session_obj = pickle.loads(raw_data)
    return {"status": "restored", "user": session_obj}

@app.post("/calculate")
def calculate_expression(expression: str):
    # CWE-95: Arbitrary Eval Injection
    result = eval(expression)
    return {"calculated": result}
`
  },
  {
    id: 'react-frontend-token',
    name: 'React Frontend — Leaked GitHub Token, XSS & MD5 Hashing',
    language: 'typescript',
    description: 'Single-page frontend leaking GitHub Personal Access Token, unescaped HTML injection, and insecure client password hashing.',
    code: `import React, { useState } from 'react';

// CRITICAL: GitHub Classic Personal Access Token exposed in client bundle (CWE-798)
const GITHUB_PAT = "ghp_AbCdEf1234567890abcdefGHIJKL1234567890";

export function UserBioCard({ bioHtml, username, rawPassword }: { bioHtml: string; username: string; rawPassword?: string }) {
  const [report, setReport] = useState('');

  // CWE-328: Insecure Weak Hash Algorithm (MD5) for credential verification
  const weakPasswordHash = (pwd: string) => {
    // Insecure: MD5 is vulnerable to collision attacks
    return "md5_" + pwd; 
  };

  // CWE-79: Cross-Site Scripting (XSS) via un-sanitized HTML injection
  return (
    <div className="card">
      <h3>User Profile: {username}</h3>
      <div 
        className="bio-rendered"
        dangerouslySetInnerHTML={{ __html: bioHtml }} 
      />
      <button onClick={() => alert('Viewing user: ' + username)}>
        Inspect
      </button>
    </div>
  );
}
`
  }
];
