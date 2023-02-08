import {
  Button,
  Checkbox,
  Heading,
  MultiStep,
  Text,
  TextInput,
} from "@ignite-ui/react";
import { ArrowRight } from "phosphor-react";
import { Container, Header } from "../styles";
import {
  IntervalBox,
  IntervalContainer,
  IntervalDay,
  IntervalInput,
  IntervalItem,
} from "./styles";

export default function TimeIntervals() {
  return (
    <Container>
      <Header>
        <Heading as="strong">Quase lá</Heading>
        <Text>
          Defina o intervalo de horaios que você esta disponivel em cada dia da
          semana.
        </Text>

        <MultiStep size={4} currentStep={3} />

        <IntervalBox as="form">
          <IntervalContainer>
            <IntervalItem>
              <IntervalDay>
                <Checkbox />
                <Text>Segunda-feira</Text>
              </IntervalDay>
              <IntervalInput>
                <TextInput size={"sm"} type="time" step={60} />
                <TextInput size={"sm"} type="time" step={60} />
              </IntervalInput>
            </IntervalItem>
            <IntervalItem>
              <IntervalDay>
                <Checkbox />
                <Text>Terça-feira</Text>
              </IntervalDay>
              <IntervalInput>
                <TextInput size={"sm"} type="time" step={60} />
                <TextInput size={"sm"} type="time" step={60} />
              </IntervalInput>
            </IntervalItem>
          </IntervalContainer>
          <Button type="submit">
            Proximo passo <ArrowRight />
          </Button>
        </IntervalBox>
      </Header>
    </Container>
  );
}
