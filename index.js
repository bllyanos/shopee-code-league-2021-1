const start = Date.now();
const data = require("./contacts.json");

const groupEmail = {};
const groupPhone = {};
const groupOrder = {};

for (let i = 0; i < data.length; i++) {
  const { Email, Phone, OrderId } = data[i];
  if (Email) {
    if (!groupEmail[Email]) {
      groupEmail[Email] = new Set();
    }
    groupEmail[Email].add(i);
  }

  if (Phone) {
    if (!groupPhone[Phone]) {
      groupPhone[Phone] = new Set();
    }
    groupPhone[Phone].add(i);
  }

  if (OrderId) {
    if (!groupOrder[OrderId]) {
      groupOrder[OrderId] = new Set();
    }
    groupOrder[OrderId].add(i);
  }
}

const emails = Object.keys(groupEmail);
const phones = Object.keys(groupPhone);
const orders = Object.keys(groupOrder);

const final = data.map((d) => {
  return {
    contacts: d.Contacts,
    calculated: false,
    trace_str: "",
    contacts_sum: 0,
  };
});

for (const e of emails) {
  const s = groupEmail[e];
  for (const [v] of s.entries()) {
    if (!final[v].trace) {
      final[v].trace = s;
    } else {
      for (const [v2] of s.entries()) {
        final[v].trace.add(v2);
      }
    }
  }
}

for (const p of phones) {
  const s = groupPhone[p];
  for (const [v] of s.entries()) {
    if (!final[v].trace) {
      final[v].trace = s;
    } else {
      for (const [v2] of s.entries()) {
        final[v].trace.add(v2);
      }
    }
  }
}

for (const o of orders) {
  const s = groupOrder[o];
  for (const [v] of s.entries()) {
    if (!final[v].trace) {
      final[v].trace = s;
    } else {
      for (const [v2] of s.entries()) {
        final[v].trace.add(v2);
      }
    }
  }
}

for (let i = 0; i < final.length; i++) {
  const trace = final[i].trace;
  const finalTrace = new Set();
  for (const [v] of trace.entries()) {
    for (const [v2] of final[v].trace.entries()) {
      finalTrace.add(v2);
    }
  }
  for (const [v] of finalTrace.entries()) {
    final[v].trace = finalTrace;
  }
}

const fs = require("fs");

for (let i = 0; i < final.length; i++) {
  const d = final[i];
  if (d.calculated) continue;
  let traces = [];
  let sum = 0;
  for (const [v] of d.trace.entries()) {
    traces.push(v);
    sum += final[v].contacts;
  }
  const traceStr = traces.sort((a, b) => a - b).join("-");
  for (const t of traces) {
    final[t].trace_str = traceStr;
    final[t].contacts_sum = sum;
    final[t].calculated = true;
  }
}

const batch = Date.now();

fs.writeFileSync(`./${batch}-final.csv`, "ticket_id,ticket_trace/contact\n", {
  encoding: "utf8",
  flag: "a",
});

for (let i = 0; i < final.length; i++) {
  const d = final[i];
  const str = `${i},"${d.trace_str}, ${d.contacts_sum}"\n`;
  fs.writeFileSync(`./${batch}-final.csv`, str, {
    encoding: "utf8",
    flag: "a",
  });
}

const end = Date.now();

const delta = end - start;

console.log("FINISHED IN", delta / 1000, "s");
