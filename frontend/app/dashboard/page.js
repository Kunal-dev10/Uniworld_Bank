"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "../utils/api";
import Link from "next/link";

export default function Dashboard() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [receiver, setReceiver] = useState("");
  const [amount, setAmount] = useState("");
  const [message, setMessage] = useState("");

  const fetchData = async (userEmail) => {
    try {
      const bal = await api.get(`/balance/${userEmail}`);
      setBalance(bal.data.balance);

      const trans = await api.get(`/transactions/${userEmail}`);
      setTransactions(trans.data);

      const userInfo = await api.get(`/user/${userEmail}`);
      setName(userInfo.data.name); // Expecting { name: "John Doe" }
    } catch (err) {
      console.error("Error fetching user data:", err);
    }
  };

  useEffect(() => {
    const storedEmail = localStorage.getItem("bankUser");
    if (!storedEmail) {
      router.push("/login");
    } else {
      setEmail(storedEmail);
      fetchData(storedEmail);
    }
  }, []);

  const handleTransfer = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/transfer", {
        sender: email,
        receiver,
        amount: parseFloat(amount),
      });

      if (res.data.success) {
        setMessage("✅ Transaction Successful!");
        setReceiver("");
        setAmount("");
        fetchData(email);
      } else {
        setMessage("❌ Transaction Failed");
      }
    } catch (err) {
      setMessage(`❌ ${err.response?.data?.error || "Error occurred"}`);
    }
  };

  const logout = () => {
    localStorage.removeItem("bankUser");
    router.push("/login");
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4 sm:px-6 font-sans">
      <div className="max-w-4xl mx-auto bg-white p-6 sm:p-8 rounded-2xl shadow-xl">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
          <h1 className="text-4xl font-extrabold text-indigo-600 flex items-center gap-2">
            🏦 KBank
          </h1>
          <button
            onClick={logout}
            className="mt-4 sm:mt-0 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition duration-200"
          >
            Logout
          </button>
        </div>

        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-700">Welcome back,</h2>
            <p className="text-xl text-indigo-700 font-semibold">{name}</p>
          </div>
          <Link
            href="/profile"
            className="text-indigo-500 hover:underline text-sm"
          >
            ✏️ Edit Profile
          </Link>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg border mb-6">
          <h3 className="text-lg text-gray-600">💰 Account Balance</h3>
          <p className="text-2xl text-green-600 font-bold">₹{balance}</p>
        </div>

        <form onSubmit={handleTransfer} className="space-y-4 mb-8">
          <h3 className="text-xl font-semibold text-gray-700 mb-2">🔁 Transfer Money</h3>
          <input
            type="email"
            placeholder="Receiver's Email"
            value={receiver}
            onChange={(e) => setReceiver(e.target.value)}
            required
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <input
            type="number"
            placeholder="Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button
            type="submit"
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg shadow"
          >
            ➤ Transfer
          </button>
        </form>

        {message && (
          <p className="mt-2 text-center font-medium text-sm text-green-600">
            {message}
          </p>
        )}

        <div className="mt-6">
          <h3 className="text-xl font-semibold text-gray-700 mb-3">
            📜 Transaction History
          </h3>
          <ul className="space-y-3">
            {transactions.length === 0 ? (
              <p className="text-gray-500">No transactions yet.</p>
            ) : (
              transactions.map((t) => (
                <li
                  key={t.id}
                  className="bg-gray-50 p-3 rounded-lg border flex justify-between items-center"
                >
                  <div>
                    <p className="font-semibold">
                      {t.sender} ➡ {t.receiver}
                    </p>
                    <p className="text-sm text-gray-500">{t.timestamp}</p>
                  </div>
                  <span className="font-bold text-green-700">
                    ₹{t.amount}
                  </span>
                </li>
              ))
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}
