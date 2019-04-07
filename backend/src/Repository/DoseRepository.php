<?php

namespace App\Repository;

use App\Entity\Dose;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Symfony\Bridge\Doctrine\RegistryInterface;

/**
 * @method Dose|null find($id, $lockMode = null, $lockVersion = null)
 * @method Dose|null findOneBy(array $criteria, array $orderBy = null)
 * @method Dose[]    findAll()
 * @method Dose[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class DoseRepository extends ServiceEntityRepository
{
    public function __construct(RegistryInterface $registry)
    {
        parent::__construct($registry, Dose::class);
    }

    public function Latest($user)
    {
        $response = $this->createQueryBuilder('s')
            ->select('MAX(s.date) as date')
            ->andWhere('s.user = :user')
            ->setParameter('user', $user)
            ->getQuery()
            ->execute();
        return $response[0]["date"];
    }

    public function Min($user)
    {
        return $response = $this->createQueryBuilder('s')
            ->select('MIN(s.amount) as value')
            ->andWhere('s.user = :user')
            ->setParameter('user', $user)
            ->orderBy('s.amount', 'ASC')
            ->setMaxResults(1)
            ->getQuery()
            ->execute();
    }

    public function Max($user)
    {
        return $response = $this->createQueryBuilder('s')
            ->select('MAX(s.amount) as value')
            ->andWhere('s.user = :user')
            ->setParameter('user', $user)
            ->setMaxResults(1)
            ->getQuery()
            ->execute();
    }

    public function MinDate($user, $date)
    {
        return $response = $this->createQueryBuilder('s')
            ->select('MIN(s.amount) as value')
            ->andWhere('s.user = :user')
            ->setParameter('user', $user)
            ->andWhere('s.date = :date')
            ->setParameter('date', $date)
            ->orderBy('s.amount', 'ASC')
            ->setMaxResults(1)
            ->getQuery()
            ->execute();
    }

    public function MaxDate($user, $date)
    {
        return $response = $this->createQueryBuilder('s')
            ->select('MAX(s.amount) as value')
            ->andWhere('s.user = :user')
            ->setParameter('user', $user)
            ->andWhere('s.date = :date')
            ->setParameter('date', $date)
            ->setMaxResults(1)
            ->getQuery()
            ->execute();
    }

    public function MinDateRange($user, $date, $range)
    {
        return $response = $this->createQueryBuilder('s')
            ->select('MIN(s.amount) as value')
            ->andWhere('s.user = :user')
            ->setParameter('user', $user)
            ->andWhere('s.date > :date')
            ->setParameter('date', $date)
            ->andWhere('s.date < :range')
            ->setParameter('range', $range)
            ->orderBy('s.amount', 'ASC')
            ->setMaxResults(1)
            ->getQuery()
            ->execute();
    }

    public function MaxDateRange($user, $date, $range)
    {
        return $response = $this->createQueryBuilder('s')
            ->select('MAX(s.amount) as value')
            ->andWhere('s.user = :user')
            ->setParameter('user', $user)
            ->andWhere('s.date > :date')
            ->setParameter('date', $date)
            ->andWhere('s.date < :range')
            ->setParameter('range', $range)
            ->setMaxResults(1)
            ->getQuery()
            ->execute();
    }

    public function AvgAll($user)
    {
        return $this->createQueryBuilder('d')
            ->select('avg(d.amount) as value')
            ->andWhere('d.user = :user')
            ->setParameter('user', $user)
            ->getQuery()
            ->execute();
    }

    public function AvgByDate($date, $user)
    {
        return $this->createQueryBuilder('d')
            ->select('avg(d.amount) as value')
            ->andWhere('d.date > :date')
            ->setParameter('date', $date)
            ->andWhere('d.user = :user')
            ->setParameter('user', $user)
            ->orderBy('d.date', 'ASC')
            ->getQuery()
            ->execute();
    }
    
    public function AvgByRange($date, $range, $user)
    {
        return $this->createQueryBuilder('d')
            ->select('avg(d.amount) as value')
            ->andWhere('d.user = :user')
            ->setParameter('user', $user)
            ->andWhere('d.date > :date')
            ->setParameter('date', $date)
            ->andWhere('d.date < :range')
            ->setParameter('range', $range)
            ->orderBy('d.date', 'ASC')
            ->getQuery()
            ->execute();
    }
    
    public function AvgAllByHours($user)
    {
        return $this->createQueryBuilder('d')
            ->select('avg(d.amount) as value, HOUR(d.date) as hour, d.type as type')
            ->groupBy('hour')
            ->andWhere('d.user = :user')
            ->setParameter('user', $user)
            ->getQuery()
            ->execute();
    }

    public function AllByDate($date, $user)
    {
        return $this->createQueryBuilder('d')
            ->andWhere('d.user = :user')
            ->setParameter('user', $user)
            ->andWhere('d.date > :date')
            ->setParameter('date', $date)
            ->orderBy('d.date', 'ASC')
            ->getQuery()
            ->execute();
    }
    
    public function AllByRange($date, $range, $user)
    {
        return $this->createQueryBuilder('d')
            ->andWhere('d.date > :date')
            ->andWhere('d.date < :range')
            ->orderBy('d.date', 'ASC')
            ->andWhere('d.user = :user')
            ->setParameter('user', $user)
            ->setParameter('date', $date)
            ->setParameter('range', $range) 
            ->getQuery()
            ->execute();
    }
}
