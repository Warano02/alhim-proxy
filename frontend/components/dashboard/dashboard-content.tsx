"use client"

import { useEffect, useState } from "react"
import { Activity, ShieldCheck, ShieldAlert, Gauge, ArrowUpRight, ArrowDownRight, Inbox } from "lucide-react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts"
import { Badge } from "@/components/ui/badge"
import { fetchSecurityStats, fetchRecentEvents, type SecurityStats, type RecentEvent } from "@/lib/dashboard"

const requestsOverTime = [
    { time: "00:00", requests: 4 },
    { time: "04:00", requests: 2 },
    { time: "08:00", requests: 11 },
    { time: "12:00", requests: 23 },
    { time: "16:00", requests: 18 },
    { time: "20:00", requests: 9 },
]

function DashboardHeader() {
    return (
        <div className="flex items-center justify-between">
            <div>
                <h1 className="text-2xl font-semibold text-foreground">Security Dashboard</h1>
                <p className="text-sm text-muted-foreground mt-1">Monitor the AI Security Gateway in real time.</p>
            </div>
            <div className="flex items-center gap-2 rounded-full border border-success/20 bg-success/10 px-3 py-1.5">
                <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-success" />
                </span>
                <span className="text-xs font-medium text-success">Gateway Online</span>
            </div>
        </div>
    )
}

interface StatCardProps {
    icon: React.ElementType
    label: string
    value: string
    delta: number
}

function StatCard({ icon: Icon, label, value, delta }: StatCardProps) {
    const positive = delta >= 0
    return (
        <div className="animate-in fade-in slide-in-from-bottom-2 rounded-xl border border-border bg-card p-5 transition-colors hover:border-strong">
            <div className="flex items-center justify-between">
                <div className="rounded-lg bg-primary/10 p-2">
                    <Icon className="h-4 w-4 text-primary" />
                </div>
                <div className={`flex items-center gap-1 text-xs font-medium ${positive ? "text-success" : "text-destructive"}`}>
                    {positive ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                    {Math.abs(delta)}%
                </div>
            </div>
            <p className="mt-4 text-2xl font-semibold text-foreground">{value}</p>
            <p className="text-xs text-muted-foreground mt-1">{label}</p>
        </div>
    )
}

function StatsCards({ stats }: { stats: SecurityStats }) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard icon={Activity} label="Total Requests" value={stats.totalRequests.toLocaleString()} delta={12} />
            <StatCard icon={ShieldCheck} label="Allowed Requests" value={stats.allowedRequests.toLocaleString()} delta={8} />
            <StatCard icon={ShieldAlert} label="Blocked Requests" value={stats.blockedRequests.toLocaleString()} delta={-4} />
            <StatCard icon={Gauge} label="Average Risk Score" value={`${stats.averageRiskScore}`} delta={-2} />
        </div>
    )
}

function RequestsChart() {
    return (
        <div className="rounded-xl border border-border bg-card p-5">
            <h3 className="text-sm font-medium text-foreground">Requests Over Time</h3>
            <div className="mt-4 h-64">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={requestsOverTime}>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                        <XAxis dataKey="time" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                        <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                        <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card-elevated))", border: "1px solid hsl(var(--border))", borderRadius: 8 }} />
                        <Line type="monotone" dataKey="requests" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    )
}

function AttackDistributionChart({ stats }: { stats: SecurityStats }) {
    const data = [
        { name: "Allowed", value: stats.allowedRequests },
        { name: "Blocked", value: stats.blockedRequests },
    ]
    const colors = ["hsl(var(--success))", "hsl(var(--destructive))"]
    return (
        <div className="rounded-xl border border-border bg-card p-5">
            <h3 className="text-sm font-medium text-foreground">Allowed vs Blocked</h3>
            <div className="mt-4 h-64">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie data={data} dataKey="value" nameKey="name" innerRadius={60} outerRadius={90} paddingAngle={4}>
                            {data.map((entry, index) => (
                                <Cell key={entry.name} fill={colors[index]} stroke="transparent" />
                            ))}
                        </Pie>
                        <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card-elevated))", border: "1px solid hsl(var(--border))", borderRadius: 8 }} />
                        <Legend wrapperStyle={{ fontSize: 12, color: "hsl(var(--muted-foreground))" }} />
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </div>
    )
}

function EmptyState() {
    return (
        <div className="flex flex-col items-center justify-center gap-3 py-16">
            <div className="rounded-full bg-card-elevated p-4">
                <Inbox className="h-6 w-6 text-muted-foreground" />
            </div>
            <p className="text-sm text-muted-foreground">No security events detected.</p>
        </div>
    )
}

function LoadingSkeleton() {
    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {Array.from({ length: 4 }).map((_, index) => (
                    <div key={index} className="h-28 rounded-xl border border-border bg-card animate-pulse" />
                ))}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="h-80 rounded-xl border border-border bg-card animate-pulse" />
                <div className="h-80 rounded-xl border border-border bg-card animate-pulse" />
            </div>
            <div className="h-96 rounded-xl border border-border bg-card animate-pulse" />
        </div>
    )
}

function formatTime(iso: string) {
    return new Date(iso).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
}

function RecentEventsTable({ events }: { events: RecentEvent[] }) {
    if (events.length === 0) return <EmptyState />
    return (
        <div className="rounded-xl border border-border bg-card overflow-hidden">
            <div className="p-5 pb-0">
                <h3 className="text-sm font-medium text-foreground">Recent Security Events</h3>
            </div>
            <div className="mt-4 overflow-x-auto">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="border-t border-border text-left text-xs text-muted-foreground">
                            <th className="px-5 py-3 font-medium">Time</th>
                            <th className="px-5 py-3 font-medium">Prompt</th>
                            <th className="px-5 py-3 font-medium">Category</th>
                            <th className="px-5 py-3 font-medium">Risk Score</th>
                            <th className="px-5 py-3 font-medium">Decision</th>
                        </tr>
                    </thead>
                    <tbody>
                        {events.slice(0, 10).map((event) => (
                            <tr key={event.requestId} className="border-t border-border hover:bg-card-elevated transition-colors">
                                <td className="px-5 py-3 text-muted-foreground whitespace-nowrap">{formatTime(event.createdAt)}</td>
                                <td className="px-5 py-3 text-foreground max-w-xs truncate">{event.prompt}</td>
                                <td className="px-5 py-3 text-muted-foreground">{event.attackCategory}</td>
                                <td className="px-5 py-3 text-foreground">{event.riskScore}</td>
                                <td className="px-5 py-3">
                                    <Badge className={event.status === "blocked" ? "bg-destructive/10 text-destructive border-destructive/20" : "bg-success/10 text-success border-success/20"}>
                                        {event.status === "blocked" ? "Blocked" : "Allowed"}
                                    </Badge>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export function DashboardContent() {
    const [stats, setStats] = useState<SecurityStats | null>(null)
    const [events, setEvents] = useState<RecentEvent[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function load() {
            const [statsData, eventsData] = await Promise.all([fetchSecurityStats(), fetchRecentEvents()])
            setStats(statsData)
            setEvents(eventsData)
            setLoading(false)
        }
        load()
    }, [])

    if (loading || !stats) {
        return (
            <div className="p-6 space-y-6">
                <DashboardHeader />
                <LoadingSkeleton />
            </div>
        )
    }

    return (
        <div className="p-6 space-y-6">
            <DashboardHeader />
            <StatsCards stats={stats} />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <RequestsChart />
                <AttackDistributionChart stats={stats} />
            </div>
            <RecentEventsTable events={events} />
        </div>
    )
}