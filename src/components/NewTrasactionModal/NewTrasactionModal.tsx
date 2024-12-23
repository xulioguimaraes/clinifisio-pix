
import { ChangeEvent, FormEvent, useState } from "react"
import ReactModal from "react-modal"
import {  IValuesTransactionModal } from "../../interface/interfaces"
import setTransaction from "../../services/setTransaction"
import { Spinner } from "../Spinner/Spinner"
import styles from "./styles.module.scss"
interface Props {
    isOpen: boolean
    onRequestClose: () => void
}

const initialValues = () => {
    return {
        title: '',
        price: "",
        description: '',
        type: true
    }
}
ReactModal.setAppElement("#__next")
export const NewTrasactionModal = (props: Props) => {
    const [type, setType] = useState(false)
    const [values, setValues] = useState<IValuesTransactionModal>(initialValues)
    const [error, setError] = useState(false)
    const [valueIsEmpty, setValueIsEmpty] = useState(false)
    const [isOpen, setIsOpen] = useState(false)


    const handleCreateNewTransaction = async (e: FormEvent) => {
        e.preventDefault()
        if (values.title === "" || values.price === "") {
            setValueIsEmpty(true)
            return
        }
        // setIsOpen(true)
        const objSend = {
            ...values,
            price: values.price.replace(/[^0-9]/g, ''),
            type: type,
        }
        const response = setTransaction(objSend)
       
        if (response) {
            setValues(initialValues)
            closeSpinner()
            return props.onRequestClose()
        }
        return setError(true)
    }
    const closeSpinner = () => {
        setIsOpen(false)
    }
    const onChangeInputs = (e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLTextAreaElement>) => {
        const { name, value } = e.target
        if (values.title !== "") {
            setValueIsEmpty(false)

        }
        if (name === "price") {
            return setValues({ ...values, [name]: new Intl.NumberFormat("pt-BR", { style: 'currency', currency: 'BRL' }).format(Number(value.replace(/[^0-9]/g, '')) / 100) })
        }
        setValues({ ...values, [name]: value })
    }
    const onRequestClosed = () => {
        setValues(initialValues)
        return props.onRequestClose()
    }
    return (
        <ReactModal
            isOpen={props.isOpen}
            onRequestClose={onRequestClosed}
            overlayClassName={`${styles.modalOverlay}`}
            className={`${styles.modalContent}`}
        >
            <Spinner isOpen={isOpen} />
            <button
                className={styles.modalClose}
                type="button"
                onClick={onRequestClosed}>
                <img src="/images/close.svg" alt="fechar modal" />
            </button>
            <form className={styles.container} onSubmit={handleCreateNewTransaction}>
                <h2>Cadastar Transação</h2>
                {error && <section className='__error'>
                    <h3>
                        {"Erro ao cadastar transação"}
                    </h3>
                </section>}
                {valueIsEmpty && <section className='__error'>
                    <h3>
                        {"Preencha os campos de Titulo e Preço"}
                    </h3>
                </section>}
                <input
                    type="text"
                    name="title"
                    value={values.title}
                    onChange={e => onChangeInputs(e)}
                    placeholder="Titulo" />
                <input
                    type="text"
                    name="price"
                    value={values.price.toString()}
                    onChange={e => onChangeInputs(e)}
                    placeholder="Valor" />
                <div className={styles.typeTransaction}>
                    <button
                        className={type ? styles.deposit : ""}
                        type="button"
                        onClick={() => setType(true)}>
                        <img src="/images/income.svg" alt="Entrada" />
                        <span>Entrada</span>
                    </button>
                    <button
                        className={type ? "" : styles.withraw}
                        type="button"
                        onClick={() => setType(false)}>
                        <img src="/images/outcome.svg" alt="Saida" />
                        <span>Saida</span>
                    </button>
                </div>
                <textarea

                    name="description"
                    value={values.description}
                    onChange={e => onChangeInputs(e)}
                    placeholder="Descrição" />

                <button type="submit">Cadastrar</button>
            </form>
        </ReactModal>
    )
}
