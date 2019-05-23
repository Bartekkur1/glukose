<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Validator\Constraints as Assert;

/**
 * @ORM\Entity(repositoryClass="App\Repository\DoseRepository")
 */
class Dose implements \JsonSerializable, IUpdateable
{
    /**
     * @ORM\Id()
     * @ORM\GeneratedValue()
     * @ORM\Column(type="integer")
     */
    private $id;

    /**
     * @ORM\ManyToOne(targetEntity="App\Entity\User", inversedBy="dose")
     * @ORM\JoinColumn(nullable=false)
     */
    private $user;

    /**
     * @ORM\Column(type="integer")
     * @Assert\NotBlank(message = "Ilość nie może być pusta")
     */
    private $amount;

    /**
     * @ORM\Column(type="string", length=128)
     * @Assert\NotBlank(message = "Typ nie może być pusty")
     */
    private $type;

    /**
     * @ORM\Column(type="datetime")
     * @Assert\NotBlank(message = "Data nie może być pusta")
     */
    private $date;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getUser(): ?User
    {
        return $this->user;
    }

    public function setUser(?User $user): self
    {
        $this->user = $user;

        return $this;
    }

    public function getAmount(): ?int
    {
        return $this->amount;
    }

    public function setAmount(int $amount): self
    {
        $this->amount = $amount;

        return $this;
    }

    public function getType(): ?string
    {
        return $this->type;
    }

    public function setType(string $type): self
    {
        $this->type = $type;

        return $this;
    }

    public function getDate(): ?\DateTimeInterface
    {
        return $this->date;
    }

    public function setDate(\DateTimeInterface $date): self
    {
        $this->date = $date;

        return $this;
    }

    public function jsonSerialize() : array
    {
        return [
            "amount" => $this->amount,
            "type" => $this->type,
            "date" => $this->date->format("Y-m-d H:i:s"),
            "id" => $this->id
        ];
    }  

    public function updateFromInput($input)
    {
        $this->setAmount($input["amount"]);
        $this->setType($input["type"]);
        if(isset($input["date"]))
        {
            $date = new \DateTime($input["date"]);
            $date->setTimezone(new \DateTimeZone("Europe/Warsaw"));
            $this->setDate($date);
        }
    }
}
