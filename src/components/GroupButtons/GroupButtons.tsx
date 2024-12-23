
import React, {   useState } from 'react'

import { queryClient } from '../../services/queryClient'
import { supabase } from '../../services/supabase'
import { Spinner } from '../Spinner/Spinner'
import styles from "./styles.module.scss"

export const GroupButtons = () => {
    const grupButtons = [
        { name: "Mês", id: 1 },
        { name: "Semana", id: 2 },
        { name: "Dia", id: 3 },
    ]
    const handleCloseSpinner = () => {
        setTimeout(() => {
            setShowSpinner(false)
        }, 3000);
    }
    const [valueGroup, setValueGroup] = useState(1)
    const [showSpinner, setShowSpinner] = useState(false)
    const handleFilter = async (id: number) => {
        setShowSpinner(true)
        setValueGroup(id)
        const date = new Date()
        if (id === 3) {
            const { data } = await supabase.rpc("getlistday", { dia: date.getDate() })
            queryClient.setQueryData("list", data)
            handleCloseSpinner()
        } else if (id === 1) {

            const { data } = await supabase.rpc("getlistmonth", { mes: date.getMonth() + 1 })
            queryClient.setQueryData("list", data)
            handleCloseSpinner()

        } else if (id === 2) {
            const sunday = new Date()
            const days = sunday.getDay()
            sunday.setDate(sunday.getDate() - days)
            const date = new Date()
            const inicio = sunday.toISOString(), fim = date.toISOString()
            const { data } = await supabase.rpc("getlistperiodo", { inicio, fim })
            queryClient.setQueryData("list", data)
            handleCloseSpinner()

        }
    }
    return (
        <>
            <aside className={styles.group}>
                {grupButtons.map(item => {
                    return <>
                        <input
                            value={item.id}
                            key={item.id + item.name}
                            checked={valueGroup === item.id}
                            type="checkbox"
                            name={item.name}
                            id={item.name}
                            onChange={(e) => handleFilter(Number(e.target.value))} />
                        <label
                            className={valueGroup === item.id ? styles.checked : ""}
                            htmlFor={item.name}>{item.name}</label>
                    </>
                })}
            </aside>
            <Spinner isOpen={showSpinner} />
        </>
    )
}
